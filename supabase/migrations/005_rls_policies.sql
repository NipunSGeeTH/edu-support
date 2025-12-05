-- Migration: Add Row Level Security (RLS) policies
-- This migration adds proper security policies to protect data

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_categories ENABLE ROW LEVEL SECURITY;

-- ============================================
-- MATERIALS TABLE POLICIES
-- ============================================

-- Anyone can read approved materials
DROP POLICY IF EXISTS "Anyone can view approved materials" ON public.materials;
CREATE POLICY "Anyone can view approved materials"
ON public.materials FOR SELECT
USING (status = 'approved');

-- Authenticated users can view their own materials (any status)
DROP POLICY IF EXISTS "Users can view own materials" ON public.materials;
CREATE POLICY "Users can view own materials"
ON public.materials FOR SELECT
TO authenticated
USING (contributor_id = auth.uid());

-- Authenticated users can insert materials
DROP POLICY IF EXISTS "Authenticated users can insert materials" ON public.materials;
CREATE POLICY "Authenticated users can insert materials"
ON public.materials FOR INSERT
TO authenticated
WITH CHECK (
  -- User can only insert with their own contributor_id or null (anonymous)
  (contributor_id IS NULL OR contributor_id = auth.uid())
);

-- Allow anonymous inserts (for non-logged in users submitting resources)
DROP POLICY IF EXISTS "Anyone can insert pending materials" ON public.materials;
CREATE POLICY "Anyone can insert pending materials"
ON public.materials FOR INSERT
TO anon
WITH CHECK (
  -- Anonymous submissions must have null contributor_id and pending status
  contributor_id IS NULL AND status = 'pending'
);

-- Users can update only their own materials
DROP POLICY IF EXISTS "Users can update own materials" ON public.materials;
CREATE POLICY "Users can update own materials"
ON public.materials FOR UPDATE
TO authenticated
USING (contributor_id = auth.uid())
WITH CHECK (contributor_id = auth.uid());

-- Users can delete only their own materials
DROP POLICY IF EXISTS "Users can delete own materials" ON public.materials;
CREATE POLICY "Users can delete own materials"
ON public.materials FOR DELETE
TO authenticated
USING (contributor_id = auth.uid());

-- ============================================
-- SESSIONS TABLE POLICIES
-- ============================================

-- Anyone can read approved sessions
DROP POLICY IF EXISTS "Anyone can view approved sessions" ON public.sessions;
CREATE POLICY "Anyone can view approved sessions"
ON public.sessions FOR SELECT
USING (status = 'approved');

-- Authenticated users can view their own sessions (any status)
DROP POLICY IF EXISTS "Users can view own sessions" ON public.sessions;
CREATE POLICY "Users can view own sessions"
ON public.sessions FOR SELECT
TO authenticated
USING (contributor_id = auth.uid());

-- Authenticated users can insert sessions
DROP POLICY IF EXISTS "Authenticated users can insert sessions" ON public.sessions;
CREATE POLICY "Authenticated users can insert sessions"
ON public.sessions FOR INSERT
TO authenticated
WITH CHECK (
  (contributor_id IS NULL OR contributor_id = auth.uid())
);

-- Allow anonymous inserts for sessions
DROP POLICY IF EXISTS "Anyone can insert pending sessions" ON public.sessions;
CREATE POLICY "Anyone can insert pending sessions"
ON public.sessions FOR INSERT
TO anon
WITH CHECK (
  contributor_id IS NULL AND status = 'pending'
);

-- Users can update only their own sessions
DROP POLICY IF EXISTS "Users can update own sessions" ON public.sessions;
CREATE POLICY "Users can update own sessions"
ON public.sessions FOR UPDATE
TO authenticated
USING (contributor_id = auth.uid())
WITH CHECK (contributor_id = auth.uid());

-- Users can delete only their own sessions
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.sessions;
CREATE POLICY "Users can delete own sessions"
ON public.sessions FOR DELETE
TO authenticated
USING (contributor_id = auth.uid());

-- ============================================
-- LOOKUP TABLES POLICIES (Read-only for all)
-- ============================================

-- Subjects - read only
DROP POLICY IF EXISTS "Anyone can view subjects" ON public.subjects;
CREATE POLICY "Anyone can view subjects"
ON public.subjects FOR SELECT
USING (true);

-- Streams - read only
DROP POLICY IF EXISTS "Anyone can view streams" ON public.streams;
CREATE POLICY "Anyone can view streams"
ON public.streams FOR SELECT
USING (true);

-- Levels - read only
DROP POLICY IF EXISTS "Anyone can view levels" ON public.levels;
CREATE POLICY "Anyone can view levels"
ON public.levels FOR SELECT
USING (true);

-- Languages - read only
DROP POLICY IF EXISTS "Anyone can view languages" ON public.languages;
CREATE POLICY "Anyone can view languages"
ON public.languages FOR SELECT
USING (true);

-- Material categories - read only
DROP POLICY IF EXISTS "Anyone can view material_categories" ON public.material_categories;
CREATE POLICY "Anyone can view material_categories"
ON public.material_categories FOR SELECT
USING (true);

-- ============================================
-- CONTRIBUTORS TABLE POLICIES
-- ============================================

-- Anyone can view contributors
DROP POLICY IF EXISTS "Anyone can view contributors" ON public.contributors;
CREATE POLICY "Anyone can view contributors"
ON public.contributors FOR SELECT
USING (true);

-- Users can update only their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.contributors;
CREATE POLICY "Users can update own profile"
ON public.contributors FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.contributors;
CREATE POLICY "Users can insert own profile"
ON public.contributors FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- ============================================
-- RESOURCES TABLE POLICIES (Legacy table)
-- ============================================

-- Anyone can read resources
DROP POLICY IF EXISTS "Anyone can view resources" ON public.resources;
CREATE POLICY "Anyone can view resources"
ON public.resources FOR SELECT
USING (true);

-- Authenticated users can insert resources
DROP POLICY IF EXISTS "Authenticated users can insert resources" ON public.resources;
CREATE POLICY "Authenticated users can insert resources"
ON public.resources FOR INSERT
TO authenticated
WITH CHECK (contributor_id = auth.uid());

-- Users can update only their own resources
DROP POLICY IF EXISTS "Users can update own resources" ON public.resources;
CREATE POLICY "Users can update own resources"
ON public.resources FOR UPDATE
TO authenticated
USING (contributor_id = auth.uid())
WITH CHECK (contributor_id = auth.uid());

-- Users can delete only their own resources
DROP POLICY IF EXISTS "Users can delete own resources" ON public.resources;
CREATE POLICY "Users can delete own resources"
ON public.resources FOR DELETE
TO authenticated
USING (contributor_id = auth.uid());
