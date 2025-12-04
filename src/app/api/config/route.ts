import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all lookup data in parallel
    const [levelsResult, streamsResult, languagesResult, categoriesResult, subjectsResult] = await Promise.all([
      supabase
        .from('levels')
        .select('code, name')
        .eq('is_active', true)
        .order('display_order'),
      supabase
        .from('streams')
        .select('code, name, level_code')
        .eq('is_active', true)
        .order('display_order'),
      supabase
        .from('languages')
        .select('code, name')
        .eq('is_active', true)
        .order('display_order'),
      supabase
        .from('material_categories')
        .select('code, name')
        .eq('is_active', true)
        .order('display_order'),
      supabase
        .from('subjects')
        .select('code, name, stream_code, level_code')
        .eq('is_active', true)
        .order('display_order'),
    ]);

    // Check for errors
    if (levelsResult.error || streamsResult.error || languagesResult.error || categoriesResult.error || subjectsResult.error) {
      console.error('Error fetching lookup data:', {
        levels: levelsResult.error,
        streams: streamsResult.error,
        languages: languagesResult.error,
        categories: categoriesResult.error,
        subjects: subjectsResult.error,
      });
      return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 });
    }

    // Transform data
    const levels = levelsResult.data?.map(l => l.code) || [];
    
    // Group streams by level (excluding 'General' for display - it's internal for O/L)
    const streams: Record<string, string[]> = {};
    levelsResult.data?.forEach(level => {
      streams[level.code] = streamsResult.data
        ?.filter(s => s.level_code === level.code && s.code !== 'General')
        .map(s => s.code) || [];
    });

    const languages = languagesResult.data?.map(l => l.code) || [];
    const materialCategories = categoriesResult.data?.map(c => c.code) || [];

    // Group subjects by stream (for filtering)
    const subjects: Record<string, string[]> = {};
    const allStreamCodes = streamsResult.data?.map(s => s.code) || [];
    allStreamCodes.forEach(streamCode => {
      subjects[streamCode] = [...new Set(
        subjectsResult.data
          ?.filter(s => s.stream_code === streamCode)
          .map(s => s.code) || []
      )];
    });

    // Get unique subjects by level
    const subjectsByLevel: Record<string, string[]> = {};
    levelsResult.data?.forEach(level => {
      subjectsByLevel[level.code] = [...new Set(
        subjectsResult.data
          ?.filter(s => s.level_code === level.code)
          .map(s => s.code) || []
      )];
    });

    // Create mapping: level -> subject -> streams[] (from database)
    // This tells us which streams each subject belongs to
    const subjectStreams: Record<string, Record<string, string[]>> = {};
    levelsResult.data?.forEach(level => {
      subjectStreams[level.code] = {};
      
      // Get all subjects for this level
      const levelSubjects = subjectsResult.data?.filter(s => s.level_code === level.code) || [];
      
      // Group by subject code to find all streams for each subject
      levelSubjects.forEach(subj => {
        if (!subjectStreams[level.code][subj.code]) {
          subjectStreams[level.code][subj.code] = [];
        }
        if (!subjectStreams[level.code][subj.code].includes(subj.stream_code)) {
          subjectStreams[level.code][subj.code].push(subj.stream_code);
        }
      });
    });

    return NextResponse.json({
      levels,
      streams, // streams by level (for filtering, excludes 'General')
      languages,
      materialCategories,
      subjects, // subjects by stream (for filtering)
      subjectsByLevel, // unique subjects per level (for submit form)
      subjectStreams, // subject -> streams mapping (to know which streams to store)
      sessionTypes: ['Live', 'Recording'],
    });
  } catch (error) {
    console.error('Error in config API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
