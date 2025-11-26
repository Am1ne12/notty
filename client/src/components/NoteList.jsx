import { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import NoteItem from './NoteItem';
import { notesApi } from '../services/api';

function NoteList({ category, searchQuery, onRefresh }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [category, searchQuery]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (category && category !== 'all') {
        params.category = category;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await notesApi.getAll(params);
      setNotes(response.data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Unable to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notesApi.delete(id);
      setNotes(notes.filter(note => note._id !== id));
      onRefresh?.();
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note');
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const response = await notesApi.togglePin(id);
      setNotes(notes.map(note => 
        note._id === id ? response.data : note
      ).sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }));
    } catch (err) {
      console.error('Error toggling pin:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchNotes}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune note</h3>
        <p className="text-gray-500 max-w-sm">
          {category && category !== 'all'
            ? `Aucune note dans la catégorie "${category}"`
            : 'Commencez par créer votre première note!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note, index) => (
        <div key={note._id} style={{ animationDelay: `${index * 50}ms` }}>
          <NoteItem
            note={note}
            onDelete={handleDelete}
            onTogglePin={handleTogglePin}
          />
        </div>
      ))}
    </div>
  );
}

export default NoteList;
