-- Supabase Database Schema for EduShare (Normalized)
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

-- Drop existing types if they exist (for fresh install)
DROP TYPE IF EXISTS resource_level CASCADE;
DROP TYPE IF EXISTS resource_stream CASCADE;
DROP TYPE IF EXISTS resource_language CASCADE;
DROP TYPE IF EXISTS material_category CASCADE;
DROP TYPE IF EXISTS session_type CASCADE;
DROP TYPE IF EXISTS approval_status CASCADE;

CREATE TYPE resource_level AS ENUM ('AL', 'OL');
CREATE TYPE resource_stream AS ENUM ('Science', 'Arts', 'Commerce', 'Technology');
CREATE TYPE resource_language AS ENUM ('Sinhala', 'Tamil', 'English');
CREATE TYPE material_category AS ENUM ('Past Paper', 'Note', 'Textbook');
CREATE TYPE session_type AS ENUM ('Live', 'Recording');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- ============================================
-- TABLES
-- ============================================

-- Contributors table (synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS contributors (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Subjects lookup table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    stream resource_stream NOT NULL,
    level resource_level NOT NULL,
    UNIQUE(name, stream, level)
);

-- Materials table (Past Papers, Notes, Textbooks)
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    category material_category NOT NULL,
    level resource_level NOT NULL,
    stream resource_stream NOT NULL,
    subject TEXT NOT NULL,
    language resource_language NOT NULL,
    
    -- Contributor info (nullable for anonymous)
    contributor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    contributor_name TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    
    -- Approval status
    status approval_status DEFAULT 'pending',
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Sessions table (Live classes, Recordings)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    session_type session_type NOT NULL,
    level resource_level NOT NULL,
    stream resource_stream NOT NULL,
    subject TEXT NOT NULL,
    language resource_language NOT NULL,
    
    -- Session timing (for Live sessions)
    session_date DATE,
    start_time TIME,
    end_time TIME,
    
    -- Contributor info (nullable for anonymous)
    contributor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    contributor_name TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    
    -- Approval status
    status approval_status DEFAULT 'pending',
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- INDEXES
-- ============================================

-- Materials indexes
CREATE INDEX IF NOT EXISTS idx_materials_level ON materials(level);
CREATE INDEX IF NOT EXISTS idx_materials_stream ON materials(stream);
CREATE INDEX IF NOT EXISTS idx_materials_subject ON materials(subject);
CREATE INDEX IF NOT EXISTS idx_materials_language ON materials(language);
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_status ON materials(status);
CREATE INDEX IF NOT EXISTS idx_materials_contributor ON materials(contributor_id);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials(created_at DESC);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_level ON sessions(level);
CREATE INDEX IF NOT EXISTS idx_sessions_stream ON sessions(stream);
CREATE INDEX IF NOT EXISTS idx_sessions_subject ON sessions(subject);
CREATE INDEX IF NOT EXISTS idx_sessions_language ON sessions(language);
CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_contributor ON sessions(contributor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Materials policies
-- Anyone can view approved materials
CREATE POLICY "Approved materials are viewable by everyone"
ON materials FOR SELECT
USING (status = 'approved');

-- Contributors can view their own materials (any status)
CREATE POLICY "Contributors can view their own materials"
ON materials FOR SELECT
USING (auth.uid() = contributor_id);

-- Anyone can insert materials
CREATE POLICY "Anyone can insert materials"
ON materials FOR INSERT
WITH CHECK (true);

-- Contributors can update their own materials
CREATE POLICY "Contributors can update their own materials"
ON materials FOR UPDATE
USING (auth.uid() = contributor_id);

-- Contributors can delete their own materials
CREATE POLICY "Contributors can delete their own materials"
ON materials FOR DELETE
USING (auth.uid() = contributor_id);

-- Sessions policies
-- Anyone can view approved sessions (and not expired for live)
CREATE POLICY "Approved sessions are viewable by everyone"
ON sessions FOR SELECT
USING (
    status = 'approved' 
    AND (
        session_type = 'Recording' 
        OR session_date IS NULL 
        OR (session_date >= CURRENT_DATE)
        OR (session_date = CURRENT_DATE AND end_time >= CURRENT_TIME)
    )
);

-- Contributors can view their own sessions (any status)
CREATE POLICY "Contributors can view their own sessions"
ON sessions FOR SELECT
USING (auth.uid() = contributor_id);

-- Anyone can insert sessions
CREATE POLICY "Anyone can insert sessions"
ON sessions FOR INSERT
WITH CHECK (true);

-- Contributors can update their own sessions
CREATE POLICY "Contributors can update their own sessions"
ON sessions FOR UPDATE
USING (auth.uid() = contributor_id);

-- Contributors can delete their own sessions
CREATE POLICY "Contributors can delete their own sessions"
ON sessions FOR DELETE
USING (auth.uid() = contributor_id);

-- Contributors policies
CREATE POLICY "Contributors are viewable by everyone"
ON contributors FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON contributors FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON contributors FOR UPDATE
USING (auth.uid() = id);

-- Subjects policies (read-only for everyone)
CREATE POLICY "Subjects are viewable by everyone"
ON subjects FOR SELECT
USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to automatically create contributor profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.contributors (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_materials_updated_at ON materials;
CREATE TRIGGER update_materials_updated_at
    BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-approve resources from authenticated users
CREATE OR REPLACE FUNCTION auto_approve_authenticated()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.contributor_id IS NOT NULL AND NEW.is_anonymous = false THEN
        NEW.status = 'approved';
        NEW.approved_at = TIMEZONE('utc', NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-approval
DROP TRIGGER IF EXISTS auto_approve_materials ON materials;
CREATE TRIGGER auto_approve_materials
    BEFORE INSERT ON materials
    FOR EACH ROW EXECUTE FUNCTION auto_approve_authenticated();

DROP TRIGGER IF EXISTS auto_approve_sessions ON sessions;
CREATE TRIGGER auto_approve_sessions
    BEFORE INSERT ON sessions
    FOR EACH ROW EXECUTE FUNCTION auto_approve_authenticated();

-- ============================================
-- SEED DATA - Subjects
-- ============================================

INSERT INTO subjects (name, stream, level) VALUES
-- AL Science
('Physics', 'Science', 'AL'),
('Chemistry', 'Science', 'AL'),
('Biology', 'Science', 'AL'),
('Combined Mathematics', 'Science', 'AL'),
('ICT', 'Science', 'AL'),
-- AL Arts
('History', 'Arts', 'AL'),
('Geography', 'Arts', 'AL'),
('Political Science', 'Arts', 'AL'),
('Economics', 'Arts', 'AL'),
('Sinhala', 'Arts', 'AL'),
('Tamil', 'Arts', 'AL'),
('English Literature', 'Arts', 'AL'),
-- AL Commerce
('Accounting', 'Commerce', 'AL'),
('Business Studies', 'Commerce', 'AL'),
('Economics', 'Commerce', 'AL'),
('ICT', 'Commerce', 'AL'),
-- AL Technology
('Engineering Technology', 'Technology', 'AL'),
('Bio Systems Technology', 'Technology', 'AL'),
('Science for Technology', 'Technology', 'AL'),
('ICT', 'Technology', 'AL'),
-- OL subjects (common)
('Mathematics', 'Science', 'OL'),
('Science', 'Science', 'OL'),
('English', 'Arts', 'OL'),
('Sinhala', 'Arts', 'OL'),
('Tamil', 'Arts', 'OL'),
('History', 'Arts', 'OL'),
('Geography', 'Arts', 'OL'),
('Civic Education', 'Arts', 'OL'),
('Buddhism', 'Arts', 'OL'),
('Commerce', 'Commerce', 'OL'),
('Accounting', 'Commerce', 'OL'),
('ICT', 'Technology', 'OL')
ON CONFLICT (name, stream, level) DO NOTHING;
