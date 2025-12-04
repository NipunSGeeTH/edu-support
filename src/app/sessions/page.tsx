'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import FilterSidebar from '@/components/FilterSidebar';
import {
  Session,
  Level,
  Stream,
  Language,
  SessionType,
  SESSION_TYPES,
} from '@/types/database';
import { Video, Search, Filter, X, ExternalLink, Calendar, Clock } from 'lucide-react';

export default function SessionsPage() {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SessionType | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sessions from Supabase
  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        // RLS policy filters out expired live sessions and non-approved sessions
        // Sessions are filtered at database level using Sri Lankan time
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .order('session_date', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching sessions:', error);
        } else if (data) {
          setSessions(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Filter sessions based on selections
  useEffect(() => {
    let filtered = sessions;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.subject.toLowerCase().includes(query)
      );
    }

    if (selectedLevel) {
      filtered = filtered.filter((s) => s.level === selectedLevel);
    }

    if (selectedStream) {
      // Stream is now an array - check if the selected stream is in the array
      filtered = filtered.filter((s) => s.stream?.includes(selectedStream));
    }

    if (selectedSubject) {
      filtered = filtered.filter((s) => s.subject === selectedSubject);
    }

    if (selectedLanguage) {
      filtered = filtered.filter((s) => s.language === selectedLanguage);
    }

    if (selectedCategory) {
      filtered = filtered.filter((s) => s.session_type === selectedCategory);
    }

    setFilteredSessions(filtered);
  }, [
    sessions,
    searchQuery,
    selectedLevel,
    selectedStream,
    selectedSubject,
    selectedLanguage,
    selectedCategory,
  ]);

  const clearFilters = () => {
    setSelectedLevel(null);
    setSelectedStream(null);
    setSelectedSubject(null);
    setSelectedLanguage(null);
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedLevel || selectedStream || selectedSubject || selectedLanguage || selectedCategory || searchQuery;

  const formatTime = (time: string | null) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const isUpcoming = (session: Session) => {
    if (session.session_type !== 'Live' || !session.session_date) return false;
    
    // Get current date in Sri Lanka
    const sriLankaDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' }); // YYYY-MM-DD format
    
    // Session is upcoming if it's today or in the future
    return session.session_date >= sriLankaDate;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t('sessions.title')}</h1>
        </div>
        <p className="text-gray-600">{t('sessions.subtitle')}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('sessions.search')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            aria-label={t('filter.title')}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block w-64 shrink-0">
          <FilterSidebar
            selectedLevel={selectedLevel}
            selectedStream={selectedStream}
            selectedSubject={selectedSubject}
            selectedLanguage={selectedLanguage}
            selectedCategory={selectedCategory}
            categories={SESSION_TYPES}
            onLevelChange={setSelectedLevel}
            onStreamChange={setSelectedStream}
            onSubjectChange={setSelectedSubject}
            onLanguageChange={setSelectedLanguage}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="fixed right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{t('filter.title')}</h2>
                <button 
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar
                selectedLevel={selectedLevel}
                selectedStream={selectedStream}
                selectedSubject={selectedSubject}
                selectedLanguage={selectedLanguage}
                selectedCategory={selectedCategory}
                categories={SESSION_TYPES}
                onLevelChange={setSelectedLevel}
                onStreamChange={setSelectedStream}
                onSubjectChange={setSelectedSubject}
                onLanguageChange={setSelectedLanguage}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>
        )}

        {/* Sessions Grid */}
        <div className="flex-1">
          {/* Results Count & Clear Filters */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              {t('sessions.showing', { count: filteredSessions.length, s: filteredSessions.length !== 1 ? 's' : '' })}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {t('filter.clear')}
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('sessions.no_results')}</h3>
              <p className="text-gray-600">{t('sessions.no_results_hint')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        session.session_type === 'Live' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {session.session_type === 'Live' ? '🔴 ' : '📹 '}
                        {session.session_type}
                      </span>
                      {isUpcoming(session) && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{session.language}</span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {session.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {session.description}
                  </p>

                  {/* Session Schedule */}
                  {session.session_type === 'Live' && session.session_date && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(session.session_date)}
                      </div>
                      {session.start_time && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(session.start_time)}
                          {session.end_time && ` - ${formatTime(session.end_time)}`}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {session.level}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {session.stream}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {session.subject}
                    </span>
                  </div>
                  
                  <a
                    href={session.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center text-sm font-medium ${
                      session.session_type === 'Live' 
                        ? 'text-red-600 hover:text-red-700' 
                        : 'text-purple-600 hover:text-purple-700'
                    }`}
                  >
                    {session.session_type === 'Live' ? t('common.join') : t('common.open')}
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
