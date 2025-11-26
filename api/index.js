const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB connection
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  cachedDb = conn;
  return cachedDb;
}

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.matchPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Note Schema
const NoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, default: 'Perso' },
  content: { type: String, default: '' },
  tags: [String],
  isPinned: { type: Boolean, default: false }
}, { timestamps: true });

const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);

// Auth middleware
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Not authorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ success: false, error: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized' });
  }
};

// Generate token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    await connectToDatabase();
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, error: 'Email already registered' });
    
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      data: { id: user._id, name: user.name, email: user.email, initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase() }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    await connectToDatabase();
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      data: { id: user._id, name: user.name, email: user.email, initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase() }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/auth/me', protect, async (req, res) => {
  res.json({
    success: true,
    data: { id: req.user._id, name: req.user.name, email: req.user.email, initials: req.user.name.split(' ').map(n => n[0]).join('').toUpperCase() }
  });
});

// NOTES ROUTES
app.get('/api/notes', protect, async (req, res) => {
  try {
    await connectToDatabase();
    const { category, search } = req.query;
    let query = { user: req.user._id };
    
    if (category && category !== 'all') query.category = category;
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];
    
    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });
    res.json({ success: true, count: notes.length, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/notes/:id', protect, async (req, res) => {
  try {
    await connectToDatabase();
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, error: 'Note not found' });
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/notes', protect, async (req, res) => {
  try {
    await connectToDatabase();
    const note = await Note.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/notes/:id', protect, async (req, res) => {
  try {
    await connectToDatabase();
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, error: 'Note not found' });
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/notes/:id', protect, async (req, res) => {
  try {
    await connectToDatabase();
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, error: 'Note not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/notes/:id/pin', protect, async (req, res) => {
  try {
    await connectToDatabase();
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, error: 'Note not found' });
    note.isPinned = !note.isPinned;
    await note.save();
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CATEGORIES ROUTE
app.get('/api/categories', protect, async (req, res) => {
  try {
    await connectToDatabase();
    const categories = await Note.distinct('category', { user: req.user._id });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = app;
