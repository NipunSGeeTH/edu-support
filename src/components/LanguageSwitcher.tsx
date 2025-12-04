'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { UILanguage } from '@/types/database';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages: { code: UILanguage; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = languages.find((l) => l.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage?.nativeName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                language === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-gray-500 ml-1">({lang.name})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
