'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UILanguage, translations } from '@/types/database';

interface LanguageContextType {
  language: UILanguage;
  setLanguage: (lang: UILanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<UILanguage>('en');

  useEffect(() => {
    // Load language from localStorage
    const saved = localStorage.getItem('edushare-language') as UILanguage;
    if (saved && ['en', 'si', 'ta'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: UILanguage) => {
    setLanguageState(lang);
    localStorage.setItem('edushare-language', lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || translations['en'][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
