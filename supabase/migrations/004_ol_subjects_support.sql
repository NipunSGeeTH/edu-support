-- Migration: Support multiple streams per resource
-- In Sri Lanka's education system, some subjects (ICT, Economics) belong to multiple streams
-- When a resource is submitted, it should be tagged with ALL streams the subject belongs to

-- ============================================
-- STEP 1: Drop ALL constraints on stream columns FIRST
-- ============================================

-- Drop check constraints on resources table
ALTER TABLE public.resources DROP CONSTRAINT IF EXISTS resources_stream_check;

-- Drop any other constraints that might reference stream
ALTER TABLE public.materials DROP CONSTRAINT IF EXISTS materials_stream_check;
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_stream_check;

-- ============================================
-- STEP 2: Drop old btree indexes (not compatible with arrays)
-- ============================================
DROP INDEX IF EXISTS idx_materials_stream;
DROP INDEX IF EXISTS idx_sessions_stream;
DROP INDEX IF EXISTS idx_resources_stream;

-- ============================================
-- STEP 3: Change column types from enum/text to text[]
-- Need to drop NOT NULL, drop any DEFAULT, then change type
-- ============================================

-- Materials: Change stream from enum to text array
ALTER TABLE public.materials 
  ALTER COLUMN stream DROP NOT NULL;
ALTER TABLE public.materials 
  ALTER COLUMN stream DROP DEFAULT;
ALTER TABLE public.materials 
  ALTER COLUMN stream TYPE text[] USING 
    CASE 
      WHEN stream IS NULL THEN NULL 
      ELSE ARRAY[stream::text] 
    END;

-- Sessions: Change stream from enum to text array  
ALTER TABLE public.sessions
  ALTER COLUMN stream DROP NOT NULL;
ALTER TABLE public.sessions
  ALTER COLUMN stream DROP DEFAULT;
ALTER TABLE public.sessions
  ALTER COLUMN stream TYPE text[] USING 
    CASE 
      WHEN stream IS NULL THEN NULL 
      ELSE ARRAY[stream::text] 
    END;

-- Resources: Change stream from text to text array
ALTER TABLE public.resources
  ALTER COLUMN stream DROP NOT NULL;
ALTER TABLE public.resources
  ALTER COLUMN stream TYPE text[] USING 
    CASE 
      WHEN stream IS NULL THEN NULL 
      ELSE ARRAY[stream::text] 
    END;

-- ============================================
-- STEP 4: Create GIN indexes for array search
-- ============================================
CREATE INDEX IF NOT EXISTS idx_materials_stream_gin ON public.materials USING GIN (stream);
CREATE INDEX IF NOT EXISTS idx_sessions_stream_gin ON public.sessions USING GIN (stream);
CREATE INDEX IF NOT EXISTS idx_resources_stream_gin ON public.resources USING GIN (stream);

-- Insert O/L stream (General) for O/L subjects
INSERT INTO public.streams (code, name, level_code, display_order, is_active)
VALUES ('General', 'General', 'OL', 1, true)
ON CONFLICT (code, level_code) DO NOTHING;

-- Insert A/L streams
INSERT INTO public.streams (code, name, level_code, display_order, is_active)
VALUES 
  ('Science', 'Science', 'AL', 1, true),
  ('Arts', 'Arts', 'AL', 2, true),
  ('Commerce', 'Commerce', 'AL', 3, true),
  ('Technology', 'Technology', 'AL', 4, true)
ON CONFLICT (code, level_code) DO NOTHING;

-- ============================================
-- O/L SUBJECTS (all under 'General' stream)
-- ============================================
INSERT INTO public.subjects (code, name, stream_code, level_code, display_order, is_active)
VALUES 
  ('Mathematics', 'Mathematics', 'General', 'OL', 1, true),
  ('Science', 'Science', 'General', 'OL', 2, true),
  ('English', 'English', 'General', 'OL', 3, true),
  ('Sinhala', 'Sinhala', 'General', 'OL', 4, true),
  ('Tamil', 'Tamil', 'General', 'OL', 5, true),
  ('History', 'History', 'General', 'OL', 6, true),
  ('Religion', 'Religion', 'General', 'OL', 7, true),
  ('Geography', 'Geography', 'General', 'OL', 10, true),
  ('Civic Education', 'Civic Education', 'General', 'OL', 11, true),
  ('Health', 'Health & Physical Education', 'General', 'OL', 12, true),
  ('ICT', 'Information & Communication Technology', 'General', 'OL', 13, true),
  ('Commerce', 'Commerce & Accounting', 'General', 'OL', 14, true),
  ('Art', 'Art', 'General', 'OL', 15, true),
  ('Music', 'Music', 'General', 'OL', 16, true),
  ('Dancing', 'Dancing', 'General', 'OL', 17, true),
  ('Drama', 'Drama & Theatre', 'General', 'OL', 18, true),
  ('Agriculture', 'Agriculture & Food Technology', 'General', 'OL', 19, true),
  ('Home Economics', 'Home Economics', 'General', 'OL', 20, true)
ON CONFLICT (code, stream_code, level_code) DO NOTHING;

-- ============================================
-- A/L SCIENCE SUBJECTS
-- ============================================
INSERT INTO public.subjects (code, name, stream_code, level_code, display_order, is_active)
VALUES 
  ('Physics', 'Physics', 'Science', 'AL', 1, true),
  ('Chemistry', 'Chemistry', 'Science', 'AL', 2, true),
  ('Biology', 'Biology', 'Science', 'AL', 3, true),
  ('Combined Mathematics', 'Combined Mathematics', 'Science', 'AL', 4, true),
  ('Agricultural Science', 'Agricultural Science', 'Science', 'AL', 6, true)
ON CONFLICT (code, stream_code, level_code) DO NOTHING;

-- ============================================
-- A/L ARTS SUBJECTS
-- ============================================
INSERT INTO public.subjects (code, name, stream_code, level_code, display_order, is_active)
VALUES 
  ('Sinhala', 'Sinhala', 'Arts', 'AL', 1, true),
  ('Tamil', 'Tamil', 'Arts', 'AL', 2, true),
  ('English', 'English', 'Arts', 'AL', 3, true),
  ('History', 'History', 'Arts', 'AL', 4, true),
  ('Geography', 'Geography', 'Arts', 'AL', 5, true),
  ('Political Science', 'Political Science', 'Arts', 'AL', 6, true),
  ('Buddhist Civilization', 'Buddhist Civilization', 'Arts', 'AL', 8, true),
  ('Hindu Civilization', 'Hindu Civilization', 'Arts', 'AL', 9, true),
  ('Christian Civilization', 'Christian Civilization', 'Arts', 'AL', 10, true),
  ('Islamic Civilization', 'Islamic Civilization', 'Arts', 'AL', 11, true),
  ('Logic', 'Logic & Scientific Method', 'Arts', 'AL', 12, true),
  ('Home Economics', 'Home Economics', 'Arts', 'AL', 13, true),
  ('Communication Studies', 'Communication Studies', 'Arts', 'AL', 14, true),
  ('Art', 'Art', 'Arts', 'AL', 15, true),
  ('Dancing', 'Dancing', 'Arts', 'AL', 16, true),
  ('Music', 'Music', 'Arts', 'AL', 17, true),
  ('Drama', 'Drama & Theatre', 'Arts', 'AL', 18, true)
ON CONFLICT (code, stream_code, level_code) DO NOTHING;

-- ============================================
-- A/L COMMERCE SUBJECTS
-- ============================================
INSERT INTO public.subjects (code, name, stream_code, level_code, display_order, is_active)
VALUES 
  ('Accounting', 'Accounting', 'Commerce', 'AL', 1, true),
  ('Business Studies', 'Business Studies', 'Commerce', 'AL', 2, true),
  ('Business Statistics', 'Business Statistics', 'Commerce', 'AL', 5, true)
ON CONFLICT (code, stream_code, level_code) DO NOTHING;

-- ============================================
-- A/L TECHNOLOGY SUBJECTS
-- ============================================
INSERT INTO public.subjects (code, name, stream_code, level_code, display_order, is_active)
VALUES 
  ('Engineering Technology', 'Engineering Technology', 'Technology', 'AL', 1, true),
  ('Bio Systems Technology', 'Bio Systems Technology', 'Technology', 'AL', 2, true),
  ('Science for Technology', 'Science for Technology', 'Technology', 'AL', 3, true)
ON CONFLICT (code, stream_code, level_code) DO NOTHING;

-- ============================================
-- MULTI-STREAM SUBJECTS (subjects available in multiple streams)
-- ============================================

-- ICT is available in Science, Commerce, and Technology
INSERT INTO public.subjects (code, name, stream_code, level_code, display_order, is_active)
VALUES 
  ('ICT', 'Information & Communication Technology', 'Science', 'AL', 5, true),
  ('ICT', 'Information & Communication Technology', 'Commerce', 'AL', 4, true),
  ('ICT', 'Information & Communication Technology', 'Technology', 'AL', 4, true)
ON CONFLICT (code, stream_code, level_code) DO NOTHING;

-- Economics is available in Arts and Commerce
INSERT INTO public.subjects (code, name, stream_code, level_code, display_order, is_active)
VALUES 
  ('Economics', 'Economics', 'Arts', 'AL', 7, true),
  ('Economics', 'Economics', 'Commerce', 'AL', 3, true)
ON CONFLICT (code, stream_code, level_code) DO NOTHING;

-- ============================================
-- LOOKUP TABLES DATA
-- ============================================
INSERT INTO public.levels (code, name, display_order, is_active)
VALUES 
  ('AL', 'Advanced Level', 1, true),
  ('OL', 'Ordinary Level', 2, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.languages (code, name, display_order, is_active)
VALUES 
  ('Sinhala', 'Sinhala', 1, true),
  ('Tamil', 'Tamil', 2, true),
  ('English', 'English', 3, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.material_categories (code, name, display_order, is_active)
VALUES 
  ('Past Paper', 'Past Paper', 1, true),
  ('Note', 'Note', 2, true),
  ('Textbook', 'Textbook', 3, true),
  ('Model Paper', 'Model Paper', 4, true)
ON CONFLICT (code) DO NOTHING;
