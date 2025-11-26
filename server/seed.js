const mongoose = require('mongoose');
require('dotenv').config();
const Note = require('./models/Note');

const sampleNotes = [
  {
    title: 'Apprendre React Hooks',
    category: 'React',
    content: `<h2>📚 React Hooks à maîtriser</h2>
<p>Les hooks sont essentiels pour le développement React moderne.</p>
<h3>To-do:</h3>
<ul class="task-list">
  <li><input type="checkbox" checked disabled> useState</li>
  <li><input type="checkbox" disabled> useEffect</li>
  <li><input type="checkbox" disabled> useContext</li>
  <li><input type="checkbox" disabled> useReducer</li>
</ul>
<h3>Code exemple:</h3>
<pre><code class="language-javascript">const [count, setCount] = useState(0);

useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);</code></pre>`,
    isPinned: true
  },
  {
    title: 'New Product Idea Design',
    category: 'Projet',
    content: `<h2>💡 New Product Idea Design</h2>
<p>Create a mobile app UI Kit that provides basic notes functionality but with some improvement.</p>
<p>There will be a choice to select what kind of notes that user needed, so the experience while taking notes can be unique based on the needs.</p>
<h3>Features:</h3>
<ul>
  <li>Rich text editing</li>
  <li>Category management</li>
  <li>Reminders</li>
  <li>Tags support</li>
</ul>`,
    tags: ['Important', 'Should be done this week', 'Top Priority']
  },
  {
    title: "Today's Tasks",
    category: 'Perso',
    content: `<h2>✅ Today's Tasks</h2>
<ul class="task-list">
  <li><input type="checkbox" checked disabled> Notes App design</li>
  <li><input type="checkbox" checked disabled> delivery App Design</li>
  <li><input type="checkbox" disabled> Online Study App Design</li>
  <li><input type="checkbox" disabled> Notes App design</li>
  <li><input type="checkbox" disabled> delivery App Design</li>
  <li><input type="checkbox" disabled> Online Study App Design</li>
  <li><input type="checkbox" disabled> Study App Design</li>
</ul>`
  },
  {
    title: 'Product Meeting',
    category: 'Projet',
    content: `<h2>📋 Product Meeting Notes</h2>
<ol>
  <li>Review of Previous Action Items</li>
  <li>Product Development Update</li>
  <li>User Feedback and Customer Insights</li>
  <li>Competitive Analysis</li>
  <li>Roadmap Discussion</li>
</ol>
<h3>Action Items:</h3>
<ul>
  <li>Prepare demo for next week</li>
  <li>Gather user feedback</li>
  <li>Update documentation</li>
</ul>`
  },
  {
    title: 'JavaScript Array Methods',
    category: 'React',
    content: `<h2>🔧 JavaScript Array Methods</h2>
<p>Essential array methods for React development:</p>
<pre><code class="language-javascript">// Map - Transform elements
const doubled = numbers.map(n => n * 2);

// Filter - Filter elements
const evens = numbers.filter(n => n % 2 === 0);

// Reduce - Aggregate values
const sum = numbers.reduce((acc, n) => acc + n, 0);

// Find - Find single element
const found = users.find(u => u.id === 1);</code></pre>`
  },
  {
    title: 'Weekend Plans',
    category: 'Perso',
    content: `<h2>🌴 Weekend Plans</h2>
<ul class="task-list">
  <li><input type="checkbox" disabled> Go hiking</li>
  <li><input type="checkbox" disabled> Read a book</li>
  <li><input type="checkbox" disabled> Cook new recipe</li>
  <li><input type="checkbox" disabled> Call family</li>
</ul>
<p><em>Remember to relax and enjoy!</em></p>`
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notty');
    console.log('Connected to MongoDB');
    
    await Note.deleteMany({});
    console.log('Cleared existing notes');
    
    await Note.insertMany(sampleNotes);
    console.log('Sample notes inserted successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
