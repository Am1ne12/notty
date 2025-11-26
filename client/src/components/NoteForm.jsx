import { useState, useEffect } from 'react';
import { X, Save, Tag, Calendar, ChevronDown } from 'lucide-react';

const defaultCategories = ['React', 'Perso', 'Projet', 'Développement', 'Ideas'];

function NoteForm({ note, onSubmit, onCancel, loading }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Perso');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setCategory(note.category || 'Perso');
      setTags(note.tags || []);
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    onSubmit({ title, category, tags });
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full text-2xl font-bold text-gray-800 bg-transparent border-none outline-none placeholder-gray-400"
          autoFocus
        />
      </div>

      {/* Category & Tags Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors"
          >
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"></span>
            <span className="text-sm font-medium text-gray-700">{category}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10 animate-scaleIn">
              {defaultCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setShowCategoryDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-emerald-50 transition-colors ${
                    category === cat ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {/* Custom category input */}
              <div className="border-t border-gray-100 mt-2 pt-2 px-4">
                <input
                  type="text"
                  placeholder="Custom category..."
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-300"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      setCategory(e.target.value.trim());
                      setShowCategoryDropdown(false);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-violet-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
            <Tag className="w-3 h-3 text-gray-400" />
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag..."
              className="bg-transparent border-none outline-none text-sm w-20 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Sauvegarder'}
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
