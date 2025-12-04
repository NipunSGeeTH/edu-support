'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ConfigData {
  levels: string[];
  streams: Record<string, string[]>;
  languages: string[];
  materialCategories: string[];
  subjects: Record<string, string[]>;
  subjectsByLevel: Record<string, string[]>;
  subjectStreams: Record<string, Record<string, string[]>>; // level -> subject -> streams[]
  sessionTypes: string[];
}

interface ConfigContextType {
  config: ConfigData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Minimal fallback values (actual data comes from database via API)
const defaultConfig: ConfigData = {
  levels: [],
  streams: {},
  languages: [],
  materialCategories: [],
  subjects: {},
  subjectsByLevel: {},
  subjectStreams: {},
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
      // Keep default empty config on error
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

// Helper hooks
export function useLevels() {
  const { config } = useConfig();
  return config?.levels || [];
}

export function useStreams(level?: string) {
  const { config } = useConfig();
  if (level && config?.streams[level]) {
    return config.streams[level];
  }
  return [];
}

export function useLanguages() {
  const { config } = useConfig();
  return config?.languages || [];
}

export function useMaterialCategories() {
  const { config } = useConfig();
  return config?.materialCategories || [];
}

export function useSubjects(stream?: string) {
  const { config } = useConfig();
  if (stream && config?.subjects[stream]) {
    return config.subjects[stream];
  }
  return [];
}

export function useSubjectsByLevel(level?: string) {
  const { config } = useConfig();
  if (level && config?.subjectsByLevel[level]) {
    return config.subjectsByLevel[level];
  }
  return [];
}

// Get streams that a subject belongs to (for auto-tagging when submitting)
export function useSubjectStreams(level?: string, subject?: string) {
  const { config } = useConfig();
  if (level && subject && config?.subjectStreams[level]?.[subject]) {
    return config.subjectStreams[level][subject];
  }
  return [];
}

export function useAllSubjectStreams(level?: string) {
  const { config } = useConfig();
  if (level && config?.subjectStreams[level]) {
    return config.subjectStreams[level];
  }
  return {};
}

export function useSessionTypes() {
  const { config } = useConfig();
  return config?.sessionTypes || ['Live', 'Recording'];
}
