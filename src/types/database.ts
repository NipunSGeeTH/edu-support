export type Level = 'AL' | 'OL';
export type Stream = 'Science' | 'Arts' | 'Commerce' | 'Technology';
export type ResourceType = 'Material' | 'Session';
export type ResourceCategory = 'Past Paper' | 'Note' | 'Textbook' | 'Live' | 'Recording';
export type Language = 'Sinhala' | 'Tamil' | 'English';

export interface Resource {
  id: string;
  type: ResourceType;
  category: ResourceCategory;
  level: Level;
  stream: Stream;
  subject: string;
  language: Language;
  url: string;
  description: string;
  title: string;
  created_at: string;
  updated_at: string;
  contributor_id: string;
  contributor_name?: string;
}

export interface Contributor {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      resources: {
        Row: Resource;
        Insert: Omit<Resource, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Resource, 'id' | 'created_at' | 'updated_at'>>;
      };
      contributors: {
        Row: Contributor;
        Insert: Omit<Contributor, 'created_at'>;
        Update: Partial<Omit<Contributor, 'id' | 'created_at'>>;
      };
    };
  };
}

// Constants for filter options
export const LEVELS: Level[] = ['AL', 'OL'];

export const STREAMS: Record<Level, Stream[]> = {
  AL: ['Science', 'Arts', 'Commerce', 'Technology'],
  OL: ['Science', 'Arts', 'Commerce', 'Technology'],
};

export const SUBJECTS: Record<Stream, string[]> = {
  Science: ['Physics', 'Chemistry', 'Biology', 'Combined Mathematics', 'ICT'],
  Arts: ['History', 'Geography', 'Political Science', 'Economics', 'Sinhala', 'Tamil', 'English Literature'],
  Commerce: ['Accounting', 'Business Studies', 'Economics', 'ICT'],
  Technology: ['Engineering Technology', 'Bio Systems Technology', 'Science for Technology', 'ICT'],
};

export const LANGUAGES: Language[] = ['Sinhala', 'Tamil', 'English'];

export const MATERIAL_CATEGORIES: ResourceCategory[] = ['Past Paper', 'Note', 'Textbook'];
export const SESSION_CATEGORIES: ResourceCategory[] = ['Live', 'Recording'];
