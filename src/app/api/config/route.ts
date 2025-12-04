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

    // Transform data into the format expected by the frontend
    const levels = levelsResult.data?.map(l => l.code) || [];
    
    // Group streams by level
    const streams: Record<string, string[]> = {};
    levelsResult.data?.forEach(level => {
      streams[level.code] = streamsResult.data
        ?.filter(s => s.level_code === level.code)
        .map(s => s.code) || [];
    });

    const languages = languagesResult.data?.map(l => l.code) || [];
    const materialCategories = categoriesResult.data?.map(c => c.code) || [];

    // Group subjects by stream
    const subjects: Record<string, string[]> = {};
    const uniqueStreams = [...new Set(streamsResult.data?.map(s => s.code) || [])];
    uniqueStreams.forEach(streamCode => {
      subjects[streamCode] = [...new Set(
        subjectsResult.data
          ?.filter(s => s.stream_code === streamCode)
          .map(s => s.code) || []
      )];
    });

    return NextResponse.json({
      levels,
      streams,
      languages,
      materialCategories,
      subjects,
      sessionTypes: ['Live', 'Recording'], // These are fixed enum values
    });
  } catch (error) {
    console.error('Error in config API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
