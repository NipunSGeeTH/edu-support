'use client';

import { Level, Stream, Language, LEVELS, STREAMS, SUBJECTS, LANGUAGES } from '@/types/database';

interface FilterSidebarProps<T extends string> {
  selectedLevel: Level | null;
  selectedStream: Stream | null;
  selectedSubject: string | null;
  selectedLanguage: Language | null;
  selectedCategory: T | null;
  categories: readonly T[];
  onLevelChange: (level: Level | null) => void;
  onStreamChange: (stream: Stream | null) => void;
  onSubjectChange: (subject: string | null) => void;
  onLanguageChange: (language: Language | null) => void;
  onCategoryChange: (category: T | null) => void;
}

export default function FilterSidebar<T extends string>({
  selectedLevel,
  selectedStream,
  selectedSubject,
  selectedLanguage,
  selectedCategory,
  categories,
  onLevelChange,
  onStreamChange,
  onSubjectChange,
  onLanguageChange,
  onCategoryChange,
}: FilterSidebarProps<T>) {
  const availableStreams = selectedLevel ? STREAMS[selectedLevel] : [];
  const availableSubjects = selectedStream ? SUBJECTS[selectedStream] : [];

  const handleLevelChange = (level: Level | null) => {
    onLevelChange(level);
    onStreamChange(null);
    onSubjectChange(null);
  };

  const handleStreamChange = (stream: Stream | null) => {
    onStreamChange(stream);
    onSubjectChange(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-20">
      <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>

      {/* Level Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Level
        </label>
        <div className="flex gap-2">
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => handleLevelChange(selectedLevel === level ? null : level)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                selectedLevel === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Stream Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stream
        </label>
        <select
          value={selectedStream || ''}
          onChange={(e) => handleStreamChange(e.target.value as Stream || null)}
          disabled={!selectedLevel}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">All Streams</option>
          {availableStreams.map((stream) => (
            <option key={stream} value={stream}>
              {stream}
            </option>
          ))}
        </select>
      </div>

      {/* Subject Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject
        </label>
        <select
          value={selectedSubject || ''}
          onChange={(e) => onSubjectChange(e.target.value || null)}
          disabled={!selectedStream}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">All Subjects</option>
          {availableSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Language Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Medium
        </label>
        <select
          value={selectedLanguage || ''}
          onChange={(e) => onLanguageChange(e.target.value as Language || null)}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Languages</option>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Category Tabs */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(selectedCategory === category ? null : category)}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          onLevelChange(null);
          onStreamChange(null);
          onSubjectChange(null);
          onLanguageChange(null);
          onCategoryChange(null);
        }}
        className="w-full py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
