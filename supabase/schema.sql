-- Supabase Database Schema for EduShare
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create contributors table (synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS contributors (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('Material', 'Session')),
    category TEXT NOT NULL CHECK (category IN ('Past Paper', 'Note', 'Textbook', 'Live', 'Recording')),
    level TEXT NOT NULL CHECK (level IN ('AL', 'OL')),
    stream TEXT NOT NULL CHECK (stream IN ('Science', 'Arts', 'Commerce', 'Technology')),
    subject TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('Sinhala', 'Tamil', 'English')),
    url TEXT NOT NULL,
    description TEXT NOT NULL,
    title TEXT NOT NULL,
    contributor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contributor_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_level ON resources(level);
CREATE INDEX IF NOT EXISTS idx_resources_stream ON resources(stream);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON resources(subject);
CREATE INDEX IF NOT EXISTS idx_resources_language ON resources(language);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_contributor ON resources(contributor_id);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at DESC);

-- Enable Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read resources (public access)
CREATE POLICY "Resources are viewable by everyone"
ON resources FOR SELECT
USING (true);

-- Policy: Authenticated users can insert their own resources
CREATE POLICY "Users can insert their own resources"
ON resources FOR INSERT
WITH CHECK (auth.uid() = contributor_id);

-- Policy: Users can update their own resources
CREATE POLICY "Users can update their own resources"
ON resources FOR UPDATE
USING (auth.uid() = contributor_id);

-- Policy: Users can delete their own resources
CREATE POLICY "Users can delete their own resources"
ON resources FOR DELETE
USING (auth.uid() = contributor_id);

-- Policy: Anyone can view contributor profiles
CREATE POLICY "Contributors are viewable by everyone"
ON contributors FOR SELECT
USING (true);

-- Policy: Users can insert their own contributor profile
CREATE POLICY "Users can insert their own profile"
ON contributors FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own contributor profile
CREATE POLICY "Users can update their own profile"
ON contributors FOR UPDATE
USING (auth.uid() = id);

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

-- Trigger to auto-update updated_at on resources
DROP TRIGGER IF EXISTS update_resources_updated_at ON resources;
CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
