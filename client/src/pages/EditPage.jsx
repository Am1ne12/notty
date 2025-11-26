import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Pin,
  Check,
  Clock,
  Upload,
  MoreVertical
} from 'lucide-react';
import Editor from '../components/Editor';
import NoteForm from '../components/NoteForm';
import { notesApi } from '../services/api';

function EditPage({ onRefresh }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id;

  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Perso');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (!isNew) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const response = await notesApi.getById(id);
      const noteData = response.data;
      setNote(noteData);
      setTitle(noteData.title);
      setCategory(noteData.category);
      setContent(noteData.content);
      setTags(noteData.tags || []);
    } catch (error) {
      console.error('Error fetching note:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      setSaving(true);
      const noteData = { title, category, content, tags };
      
      if (isNew) {
        await notesApi.create(noteData);
      } else {
        await notesApi.update(id, noteData);
      }
      
      setLastSaved(new Date());
      onRefresh?.();
      
      if (isNew) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await notesApi.delete(id);
      onRefresh?.();
      navigate('/');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const handleTogglePin = async () => {
    if (!id) return;
    
    try {
      const response = await notesApi.togglePin(id);
      setNote(response.data);
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleFormSubmit = (formData) => {
    setTitle(formData.title);
    setCategory(formData.category);
    setTags(formData.tags);
    handleSave();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-violet-100">
      {/* Header */}
      <header className="sticky top-0 z-10 glass border-b border-white/20">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>

          <div className="flex items-center gap-2">
            {!isNew && (
              <>
                <button
                  onClick={handleTogglePin}
                  className={`p-2 rounded-xl transition-colors ${
                    note?.isPinned 
                      ? 'bg-amber-100 text-amber-600' 
                      : 'hover:bg-white/50 text-gray-600'
                  }`}
                >
                  <Pin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {}}
                  className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                >
                  <Upload className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save
                </>
              )}
            </button>
            {!isNew && (
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Note Form (Title, Category, Tags) */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <NoteForm
            note={{ title, category, tags }}
            onSubmit={handleFormSubmit}
            onCancel={() => navigate('/')}
            loading={saving}
          />
        </div>

        {/* Rich Text Editor */}
        <div className="mb-6">
          <Editor
            value={content}
            onChange={setContent}
            placeholder="Start writing your note..."
          />
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['Important', 'Should be done this week', 'Top Priority', 'Complete now'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (!tags.includes(tag)) {
                  setTags([...tags, tag]);
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tags.includes(tag)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 bg-violet-200 rounded-full flex items-center justify-center text-xs text-violet-600">
                Aa
              </span>
              {content.replace(/<[^>]*>/g, '').length} chars
            </span>
            {note?.reminder && (
              <span className="flex items-center gap-1 text-amber-500">
                <Clock className="w-4 h-4" />
                Reminder set
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-500" />
                Last saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {note?.updatedAt && (
              <span>
                Last edited on {new Date(note.updatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditPage;
