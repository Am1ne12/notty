# Notty - Personal Note Diary 📝

A modern, full-stack MERN application for managing personal notes with rich text editing, categories, and a beautiful UI.

![Notty Screenshot](./preview.png)

## Features

- ✨ **Rich Text Editor** - Format text with bold, italic, headers, lists, and code blocks
- 📁 **Categories** - Organize notes by categories (React, Perso, Projet, etc.)
- 🏷️ **Tags** - Add custom tags to notes for better organization
- 📌 **Pin Notes** - Pin important notes to the top
- 🔍 **Search** - Full-text search across all notes
- 📅 **Calendar View** - Visual date-based navigation
- 💅 **Modern UI** - Glass morphism design with smooth animations
- 📱 **Responsive** - Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **React Quill** - Rich text editor
- **Axios** - HTTP client
- **Highlight.js** - Code syntax highlighting
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd notty
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**
   
   Edit `server/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/notty
   PORT=5000
   NODE_ENV=development
   ```

5. **Seed the database (optional)**
   ```bash
   cd server
   npm run seed
   ```

### Running the Application

1. **Start MongoDB** (if using local instance)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

3. **Start the frontend** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/:id` | Get a single note |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |
| PATCH | `/api/notes/:id/pin` | Toggle pin status |
| GET | `/api/categories` | Get all categories |

## Project Structure

```
notty/
├── server/
│   ├── controllers/
│   │   └── noteController.js
│   ├── models/
│   │   └── Note.js
│   ├── routes/
│   │   ├── notes.js
│   │   └── categories.js
│   ├── .env
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Editor.jsx
    │   │   ├── NoteForm.jsx
    │   │   ├── NoteItem.jsx
    │   │   ├── NoteList.jsx
    │   │   └── Sidebar.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   └── EditPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## Note Schema

```javascript
{
  _id: ObjectId,
  title: String,      // Required
  category: String,   // Default: "Perso"
  content: String,    // HTML content
  tags: [String],     // Optional tags
  isPinned: Boolean,  // Default: false
  reminder: Date,     // Optional
  createdAt: Date,
  updatedAt: Date
}
```

## Screenshots

### Home Page
- Sidebar with categories
- Search bar
- Calendar strip
- Note cards with preview

### Edit Page
- Rich text editor with formatting toolbar
- Category selection
- Tag management
- Auto-save indicator

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

