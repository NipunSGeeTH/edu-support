-- ============================================
-- LOOKUP TABLES FOR DYNAMIC CONFIGURATION
-- Run this in your Supabase SQL Editor
-- ============================================

-- Levels table
CREATE TABLE IF NOT EXISTS levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,  -- 'AL', 'OL'
    name TEXT NOT NULL,         -- 'Advanced Level', 'Ordinary Level'
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Streams table
CREATE TABLE IF NOT EXISTS streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL,         -- 'Science', 'Arts', etc.
    name TEXT NOT NULL,         -- Display name
    level_code TEXT NOT NULL,   -- Which level this stream belongs to
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(code, level_code)
);

-- Languages table
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,  -- 'Sinhala', 'Tamil', 'English'
    name TEXT NOT NULL,         -- Display name
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Material Categories table
CREATE TABLE IF NOT EXISTS material_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,  -- 'Past Paper', 'Note', etc.
    name TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Update subjects table to reference the lookup tables
-- First, let's make sure subjects table has proper structure
DROP TABLE IF EXISTS subjects CASCADE;
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL,         -- Subject code/name
    name TEXT NOT NULL,         -- Display name
    stream_code TEXT NOT NULL,  -- Reference to stream
    level_code TEXT NOT NULL,   -- Reference to level
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(code, stream_code, level_code)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_streams_level ON streams(level_code);
CREATE INDEX IF NOT EXISTS idx_subjects_stream ON subjects(stream_code);
CREATE INDEX IF NOT EXISTS idx_subjects_level ON subjects(level_code);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Everyone can read lookup tables
CREATE POLICY "Levels are viewable by everyone" ON levels FOR SELECT USING (true);
CREATE POLICY "Streams are viewable by everyone" ON streams FOR SELECT USING (true);
CREATE POLICY "Languages are viewable by everyone" ON languages FOR SELECT USING (true);
CREATE POLICY "Material categories are viewable by everyone" ON material_categories FOR SELECT USING (true);
CREATE POLICY "Subjects are viewable by everyone" ON subjects FOR SELECT USING (true);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Levels
INSERT INTO levels (code, name, display_order) VALUES
    ('AL', 'Advanced Level', 1),
    ('OL', 'Ordinary Level', 2)
ON CONFLICT (code) DO NOTHING;

-- Insert Streams
INSERT INTO streams (code, name, level_code, display_order) VALUES
    -- AL Streams
    ('Science', 'Science', 'AL', 1),
    ('Arts', 'Arts', 'AL', 2),
    ('Commerce', 'Commerce', 'AL', 3),
    ('Technology', 'Technology', 'AL', 4),
    -- OL Streams (same streams available for OL)
    ('Science', 'Science', 'OL', 1),
    ('Arts', 'Arts', 'OL', 2),
    ('Commerce', 'Commerce', 'OL', 3),
    ('Technology', 'Technology', 'OL', 4)
ON CONFLICT (code, level_code) DO NOTHING;

-- Insert Languages
INSERT INTO languages (code, name, display_order) VALUES
    ('Sinhala', 'සිංහල', 1),
    ('Tamil', 'தமிழ்', 2),
    ('English', 'English', 3)
ON CONFLICT (code) DO NOTHING;

-- Insert Material Categories
INSERT INTO material_categories (code, name, display_order) VALUES
    ('Past Paper', 'Past Papers', 1),
    ('Model Paper', 'Model Papers', 2),
    ('Note', 'Notes', 3),
    ('Textbook', 'Textbooks', 4)
ON CONFLICT (code) DO NOTHING;

-- Insert Subjects
INSERT INTO subjects (code, name, stream_code, level_code, display_order) VALUES
    -- AL Science subjects
    ('Physics', 'Physics', 'Science', 'AL', 1),
    ('Chemistry', 'Chemistry', 'Science', 'AL', 2),
    ('Biology', 'Biology', 'Science', 'AL', 3),
    ('Combined Mathematics', 'Combined Mathematics', 'Science', 'AL', 4),
    ('ICT', 'ICT', 'Science', 'AL', 5),
    
    -- AL Arts subjects
    ('History', 'History', 'Arts', 'AL', 1),
    ('Geography', 'Geography', 'Arts', 'AL', 2),
    ('Political Science', 'Political Science', 'Arts', 'AL', 3),
    ('Economics', 'Economics', 'Arts', 'AL', 4),
    ('Sinhala', 'Sinhala', 'Arts', 'AL', 5),
    ('Tamil', 'Tamil', 'Arts', 'AL', 6),
    ('English Literature', 'English Literature', 'Arts', 'AL', 7),
    ('Buddhism', 'Buddhism', 'Arts', 'AL', 8),
    
    -- AL Commerce subjects
    ('Accounting', 'Accounting', 'Commerce', 'AL', 1),
    ('Business Studies', 'Business Studies', 'Commerce', 'AL', 2),
    ('Economics', 'Economics', 'Commerce', 'AL', 3),
    ('ICT', 'ICT', 'Commerce', 'AL', 4),
    
    -- AL Technology subjects
    ('Engineering Technology', 'Engineering Technology', 'Technology', 'AL', 1),
    ('Bio Systems Technology', 'Bio Systems Technology', 'Technology', 'AL', 2),
    ('Science for Technology', 'Science for Technology', 'Technology', 'AL', 3),
    ('ICT', 'ICT', 'Technology', 'AL', 4),
    
    -- OL Science subjects
    ('Mathematics', 'Mathematics', 'Science', 'OL', 1),
    ('Science', 'Science', 'Science', 'OL', 2),
    ('ICT', 'ICT', 'Science', 'OL', 3),
    
    -- OL Arts subjects
    ('History', 'History', 'Arts', 'OL', 1),
    ('Geography', 'Geography', 'Arts', 'OL', 2),
    ('Civic Education', 'Civic Education', 'Arts', 'OL', 3),
    ('English', 'English', 'Arts', 'OL', 4),
    ('Sinhala', 'Sinhala', 'Arts', 'OL', 5),
    ('Tamil', 'Tamil', 'Arts', 'OL', 6),
    ('Buddhism', 'Buddhism', 'Arts', 'OL', 7),
    
    -- OL Commerce subjects
    ('Commerce', 'Commerce', 'Commerce', 'OL', 1),
    ('Accounting', 'Accounting', 'Commerce', 'OL', 2),
    ('ICT', 'ICT', 'Commerce', 'OL', 3)
ON CONFLICT (code, stream_code, level_code) DO NOTHING;
