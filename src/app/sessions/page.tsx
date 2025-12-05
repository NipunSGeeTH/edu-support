'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfig } from '@/contexts/ConfigContext';
import FilterSidebar from '@/components/FilterSidebar';
import { parseStreamArray } from '@/lib/utils';
import {
  Session,
  Level,
  Stream,
  Language,
  SessionType,
} from '@/types/database';
import { Video, Search, Filter, X, ExternalLink, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function SessionsPage() {
  const { t } = useLanguage();
  const { config } = useConfig();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SessionType | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Get session types from config
  const sessionTypes = (config?.sessionTypes || []) as SessionType[];

  // Fetch sessions with filters and search from database
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
        let query = supabase
          .from('sessions')
          .select('*', { count: 'exact' })
          .order('session_date', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false });

        // Apply filters
        if (selectedLevel) {
          query = query.eq('level', selectedLevel);
        }
        
        if (selectedStream) {
          // Use contains for PostgreSQL text[] array column
          // This checks if the stream array contains the selected value
          query = query.contains('stream', [selectedStream]);
        }
        
        if (selectedSubject) {
          query = query.eq('subject', selectedSubject);
        }
        
        if (selectedLanguage) {
          query = query.eq('language', selectedLanguage);
        }
        
        if (selectedCategory) {
          query = query.eq('session_type', selectedCategory);
        }

        // Apply search on title, description, or subject
        if (searchQuery) {
          query = query.or(
            `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%`
          );
        }

        // Apply pagination
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
          console.error('Error fetching sessions:', error);
        } else if (data) {
          setSessions(data);
          setTotalCount(count || 0);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [selectedLevel, selectedStream, selectedSubject, selectedLanguage, selectedCategory, searchQuery, currentPage]);

  // Reset to page 1 when filters change (not when page changes)
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLevel, selectedStream, selectedSubject, selectedLanguage, selectedCategory, searchQuery]);

  const clearFilters = () => {
    setSelectedLevel(null);
    setSelectedStream(null);
    setSelectedSubject(null);
    setSelectedLanguage(null);
    setSelectedCategory(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedLevel || selectedStream || selectedSubject || selectedLanguage || selectedCategory || searchQuery;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
            categories={sessionTypes}
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
                categories={sessionTypes}
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
              {totalCount} {totalCount === 1 ? 'session' : 'sessions'} found
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
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
          ) : sessions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('sessions.no_results')}</h3>
              <p className="text-gray-600">{t('sessions.no_results_hint')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {sessions.map((session) => (
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
                    {parseStreamArray(session.stream).filter(s => s !== 'General').map((s) => (
                      <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {s}
                      </span>
                    ))}
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-medium">
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === page
                            ? 'bg-purple-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
