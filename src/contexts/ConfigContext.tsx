'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ConfigData {
  levels: string[];
  streams: Record<string, string[]>;
  languages: string[];
  materialCategories: string[];
  subjects: Record<string, string[]>;
  sessionTypes: string[];
}

interface ConfigContextType {
  config: ConfigData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Default/fallback values (used while loading or if API fails)
const defaultConfig: ConfigData = {
  levels: ['AL', 'OL'],
  streams: {
    AL: ['Science', 'Arts', 'Commerce', 'Technology'],
    OL: ['Science', 'Arts', 'Commerce', 'Technology'],
  },
  languages: ['Sinhala', 'Tamil', 'English'],
  materialCategories: ['Past Paper', 'Note', 'Textbook', 'Model Paper'],
  subjects: {
    Science: ['Physics', 'Chemistry', 'Biology', 'Combined Mathematics', 'ICT', 'Mathematics', 'Science'],
    Arts: ['History', 'Geography', 'Political Science', 'Economics', 'Sinhala', 'Tamil', 'English Literature', 'English', 'Civic Education', 'Buddhism'],
    Commerce: ['Accounting', 'Business Studies', 'Economics', 'ICT', 'Commerce'],
    Technology: ['Engineering Technology', 'Bio Systems Technology', 'Science for Technology', 'ICT'],
  },
  sessionTypes: ['Live', 'Recording'],
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/config');
      
      if (!response.ok) {
        throw new Error('Failed to fetch configuration');
      }
      
      const data = await response.json();
      setConfig(data);
    } catch (err) {
      console.error('Error fetching config:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Use default config as fallback
      setConfig(defaultConfig);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config: config || defaultConfig, isLoading, error, refetch: fetchConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

// Helper hook to get typed values
export function useLevels() {
  const { config } = useConfig();
  return config?.levels || defaultConfig.levels;
}

export function useStreams(level?: string) {
  const { config } = useConfig();
  if (level && config?.streams[level]) {
    return config.streams[level];
  }
  // Return all unique streams
  const allStreams = new Set<string>();
  Object.values(config?.streams || defaultConfig.streams).forEach(streams => {
    streams.forEach(s => allStreams.add(s));
  });
  return Array.from(allStreams);
}

export function useLanguages() {
  const { config } = useConfig();
  return config?.languages || defaultConfig.languages;
}

export function useMaterialCategories() {
  const { config } = useConfig();
  return config?.materialCategories || defaultConfig.materialCategories;
}

export function useSubjects(stream?: string) {
  const { config } = useConfig();
  if (stream && config?.subjects[stream]) {
    return config.subjects[stream];
  }
  // Return all unique subjects
  const allSubjects = new Set<string>();
  Object.values(config?.subjects || defaultConfig.subjects).forEach(subjects => {
    subjects.forEach(s => allSubjects.add(s));
  });
  return Array.from(allSubjects);
}

export function useSessionTypes() {
  const { config } = useConfig();
  return config?.sessionTypes || defaultConfig.sessionTypes;
}
