-- ============================================
-- UPDATE SESSION RLS POLICY FOR SRI LANKAN TIME
-- Run this in your Supabase SQL Editor
-- ============================================

-- First, drop the existing policy
DROP POLICY IF EXISTS "Approved sessions are viewable by everyone" ON sessions;

-- Create a function to get current Sri Lankan time
CREATE OR REPLACE FUNCTION get_sri_lanka_time()
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
    RETURN NOW() AT TIME ZONE 'Asia/Colombo';
END;
$$ LANGUAGE plpgsql STABLE;

-- Create a function to get current Sri Lankan date
CREATE OR REPLACE FUNCTION get_sri_lanka_date()
RETURNS DATE AS $$
BEGIN
    RETURN (NOW() AT TIME ZONE 'Asia/Colombo')::DATE;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create a function to get current Sri Lankan time (just time part)
CREATE OR REPLACE FUNCTION get_sri_lanka_time_only()
RETURNS TIME AS $$
BEGIN
    RETURN (NOW() AT TIME ZONE 'Asia/Colombo')::TIME;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create new policy with Sri Lankan time
-- This will automatically filter out expired live sessions
CREATE POLICY "Approved sessions are viewable by everyone"
ON sessions FOR SELECT
USING (
    status = 'approved' 
    AND (
        -- Recordings are always shown
        session_type = 'Recording' 
        -- Live sessions without date are shown
        OR session_date IS NULL 
        -- Live sessions with future dates are shown
        OR session_date > get_sri_lanka_date()
        -- Live sessions today: check if not ended yet
        OR (
            session_date = get_sri_lanka_date() 
            AND (
                end_time IS NULL 
                OR end_time > get_sri_lanka_time_only()
            )
        )
    )
);

-- Verify the policy was created
-- SELECT * FROM pg_policies WHERE tablename = 'sessions';
