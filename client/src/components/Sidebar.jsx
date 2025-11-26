import { useState, useEffect } from 'react';
import { 
  FileText, 
  Folder, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Code,
  User,
  Briefcase,
  Tag,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { categoriesApi } from '../services/api';

const defaultCategories = ['React', 'Perso', 'Projet'];

const categoryIcons = {
  'React': Code,
  'Perso': User,
  'Projet': Briefcase,
  'default': Tag
};

const categoryColors = {
  'React': 'bg-cyan-500',
  'Perso': 'bg-pink-500',
  'Projet': 'bg-violet-500',
  'default': 'bg-emerald-500'
};

function Sidebar({ selectedCategory, onCategorySelect, isOpen, onToggle, refreshKey }) {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [refreshKey]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getAll();
      if (response.data && response.data.length > 0) {
        // Merge default categories with fetched ones
        const allCategories = [...new Set([...defaultCategories, ...response.data])];
        setCategories(allCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (category) => {
    const Icon = categoryIcons[category] || categoryIcons.default;
    return Icon;
  };

  const getColor = (category) => {
    return categoryColors[category] || categoryColors.default;
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed top-4 z-50 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen ? 'left-56' : 'left-4'
        }`}
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 glass border-r border-white/20 shadow-lg z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Notty</h1>
              <p className="text-xs text-gray-500">Personal Note Diary</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {/* All Notes */}
          <button
            onClick={() => onCategorySelect('all')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                : 'hover:bg-white/50 text-gray-700'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${selectedCategory === 'all' ? 'text-white' : 'text-emerald-500'}`} />
            <span className="font-medium">Toutes les notes</span>
          </button>

          {/* Categories Header */}
          <div className="flex items-center gap-2 px-4 py-2 mt-4 mb-2">
            <Folder className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Catégories
            </span>
          </div>

          {/* Category List */}
          <div className="space-y-1">
            {loading ? (
              <div className="px-4 py-2 text-sm text-gray-400">Loading...</div>
            ) : (
              categories.map((category) => {
                const Icon = getIcon(category);
                const isSelected = selectedCategory === category;
                
                return (
                  <button
                    key={category}
                    onClick={() => onCategorySelect(category)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      isSelected
                        ? 'bg-white shadow-md text-gray-800'
                        : 'hover:bg-white/50 text-gray-600'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${getColor(category)} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{category}</span>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500"></div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.initials || user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
