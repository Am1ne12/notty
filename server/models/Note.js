const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  category: {
    type: String,
    default: 'Perso',
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  reminder: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for better search performance
NoteSchema.index({ title: 'text', content: 'text' });
NoteSchema.index({ category: 1 });

module.exports = mongoose.model('Note', NoteSchema);
