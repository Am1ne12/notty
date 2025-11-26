import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pin, 
  Trash2, 
  Clock, 
  MoreVertical,
  Lightbulb
} from 'lucide-react';

const categoryColors = {
  'React': 'from-cyan-400 to-cyan-500',
  'Perso': 'from-pink-400 to-pink-500',
  'Projet': 'from-violet-400 to-violet-500',
  'default': 'from-emerald-400 to-emerald-500'
};

const cardBgColors = {
  'React': 'bg-cyan-50',
  'Perso': 'bg-pink-50',
  'Projet': 'bg-violet-100',
  'default': 'bg-white'
};

function NoteItem({ note, onDelete, onTogglePin }) {
  const navigate = useNavigate();

  const gradientColor = categoryColors[note.category] || categoryColors.default;
  const bgColor = cardBgColors[note.category] || cardBgColors.default;

  const formattedDate = useMemo(() => {
    const date = new Date(note.updatedAt);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, [note.updatedAt]);

  const previewText = useMemo(() => {
    // Strip HTML tags and get preview
    const temp = document.createElement('div');
    temp.innerHTML = note.content || '';
    const text = temp.textContent || temp.innerText || '';
    return text.slice(0, 150) + (text.length > 150 ? '...' : '');
  }, [note.content]);

  const handleClick = () => {
    navigate(`/note/${note._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      onDelete(note._id);
    }
  };

  const handleTogglePin = (e) => {
    e.stopPropagation();
    onTogglePin(note._id);
  };

  return (
    <div
      onClick={handleClick}
      className={`${bgColor} rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-fadeIn relative group`}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
          <Pin className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Category badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${gradientColor}`}>
          <Lightbulb className="w-3 h-3" />
          {note.category}
        </span>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleTogglePin}
            className={`p-1.5 rounded-lg hover:bg-white/80 transition-colors ${
              note.isPinned ? 'text-amber-500' : 'text-gray-400'
            }`}
          >
            <Pin className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
        {note.title}
      </h3>

      {/* Preview */}
      <p className="text-sm text-gray-500 mb-4 line-clamp-3">
        {previewText || 'No content'}
      </p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-white/70 rounded-full text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
        <button className="p-1 rounded-lg hover:bg-white/80 text-gray-400 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default NoteItem;
