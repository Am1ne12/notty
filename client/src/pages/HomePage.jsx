import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Bell, 
  Menu,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NoteList from '../components/NoteList';

function HomePage({ selectedCategory, onRefresh, sidebarOpen, onToggleSidebar }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - 3);
    
    for (let i = 0; i < 9; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [selectedDate]);

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-white/50 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Hi, {user?.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="text-gray-500">
              {selectedCategory === 'all' 
                ? 'All your notes' 
                : `Notes in ${selectedCategory}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => navigate('/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Ajouter Note</span>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for notes..."
          className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-gray-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all shadow-sm"
        />
      </div>

      {/* Calendar Strip */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 7);
              setSelectedDate(newDate);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-600">
              {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <button 
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 7);
              setSelectedDate(newDate);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex justify-between">
          {calendarDays.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
                isSelected(date)
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                  : isToday(date)
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className={`text-xs ${isSelected(date) ? 'text-white/80' : 'text-gray-400'}`}>
                {date.toLocaleDateString('fr-FR', { weekday: 'short' }).charAt(0).toUpperCase()}
              </span>
              <span className={`text-lg font-semibold ${isSelected(date) ? 'text-white' : 'text-gray-700'}`}>
                {date.getDate()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <NoteList 
        category={selectedCategory} 
        searchQuery={searchQuery}
        onRefresh={onRefresh}
      />

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => navigate('/new')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full shadow-xl shadow-emerald-300 flex items-center justify-center hover:from-emerald-600 hover:to-emerald-700 transition-all md:hidden"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}

export default HomePage;
