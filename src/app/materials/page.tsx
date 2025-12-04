'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import FilterSidebar from '@/components/FilterSidebar';
import ResourceCard from '@/components/ResourceCard';
import {
  Resource,
  Level,
  Stream,
  Language,
  ResourceCategory,
  MATERIAL_CATEGORIES,
} from '@/types/database';
import { BookOpen, Search, Filter, X } from 'lucide-react';

// Sample data for demonstration
const sampleMaterials: Resource[] = [
  {
    id: '1',
    type: 'Material',
    category: 'Past Paper',
    level: 'AL',
    stream: 'Science',
    subject: 'Physics',
    language: 'English',
    url: 'https://example.com/physics-2023.pdf',
    description: 'A/L Physics 2023 Past Paper with marking scheme. Includes all three papers.',
    title: 'A/L Physics 2023 Past Paper',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    contributor_id: '1',
  },
  {
    id: '2',
    type: 'Material',
    category: 'Note',
    level: 'AL',
    stream: 'Science',
    subject: 'Chemistry',
    language: 'Sinhala',
    url: 'https://example.com/chemistry-notes.pdf',
    description: 'Comprehensive organic chemistry notes covering all A/L syllabus topics.',
    title: 'Organic Chemistry Complete Notes',
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z',
    contributor_id: '1',
  },
  {
    id: '3',
    type: 'Material',
    category: 'Textbook',
    level: 'OL',
    stream: 'Science',
    subject: 'Biology',
    language: 'English',
    url: 'https://example.com/biology-textbook.pdf',
    description: 'Official O/L Biology textbook for Grade 10 and 11 students.',
    title: 'O/L Biology Textbook',
    created_at: '2024-03-05T10:00:00Z',
    updated_at: '2024-03-05T10:00:00Z',
    contributor_id: '2',
  },
  {
    id: '4',
    type: 'Material',
    category: 'Past Paper',
    level: 'OL',
    stream: 'Arts',
    subject: 'History',
    language: 'Tamil',
    url: 'https://example.com/history-2022.pdf',
    description: 'O/L History 2022 examination paper with detailed answers.',
    title: 'O/L History 2022 Past Paper',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    contributor_id: '2',
  },
  {
    id: '5',
    type: 'Material',
    category: 'Note',
    level: 'AL',
    stream: 'Commerce',
    subject: 'Accounting',
    language: 'English',
    url: 'https://example.com/accounting-notes.pdf',
    description: 'Financial accounting notes with solved examples and practice questions.',
    title: 'Financial Accounting Notes',
    created_at: '2024-02-25T10:00:00Z',
    updated_at: '2024-02-25T10:00:00Z',
    contributor_id: '1',
  },
];

export default function MaterialsPage() {
  const [resources, setResources] = useState<Resource[]>(sampleMaterials);
  const [filteredResources, setFilteredResources] = useState<Resource[]>(sampleMaterials);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch resources from Supabase
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        // Keep sample data if Supabase is not configured
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('type', 'Material')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching resources:', error);
          // Keep sample data if there's an error
        } else if (data && data.length > 0) {
          setResources(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Filter resources based on selections
  useEffect(() => {
    let filtered = resources;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.subject.toLowerCase().includes(query)
      );
    }

    if (selectedLevel) {
      filtered = filtered.filter((r) => r.level === selectedLevel);
    }

    if (selectedStream) {
      filtered = filtered.filter((r) => r.stream === selectedStream);
    }

    if (selectedSubject) {
      filtered = filtered.filter((r) => r.subject === selectedSubject);
    }

    if (selectedLanguage) {
      filtered = filtered.filter((r) => r.language === selectedLanguage);
    }

    if (selectedCategory) {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    setFilteredResources(filtered);
  }, [
    resources,
    searchQuery,
    selectedLevel,
    selectedStream,
    selectedSubject,
    selectedLanguage,
    selectedCategory,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Materials</h1>
        </div>
        <p className="text-gray-600">
          Browse past papers, notes, and textbooks for A/L and O/L students
        </p>
      </div>

      {/* Search and Mobile Filter Toggle */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden flex items-center space-x-2 px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <FilterSidebar
            selectedLevel={selectedLevel}
            selectedStream={selectedStream}
            selectedSubject={selectedSubject}
            selectedLanguage={selectedLanguage}
            selectedCategory={selectedCategory}
            categories={MATERIAL_CATEGORIES}
            onLevelChange={setSelectedLevel}
            onStreamChange={setSelectedStream}
            onSubjectChange={setSelectedSubject}
            onLanguageChange={setSelectedLanguage}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
            <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar
                  selectedLevel={selectedLevel}
                  selectedStream={selectedStream}
                  selectedSubject={selectedSubject}
                  selectedLanguage={selectedLanguage}
                  selectedCategory={selectedCategory}
                  categories={MATERIAL_CATEGORIES}
                  onLevelChange={setSelectedLevel}
                  onStreamChange={setSelectedStream}
                  onSubjectChange={setSelectedSubject}
                  onLanguageChange={setSelectedLanguage}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
            </div>
          </div>
        )}

        {/* Resource Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredResources.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
