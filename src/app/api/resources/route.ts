import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourceSchema, isValidTimeFormat } from '@/lib/validation';

// ============================================
// Rate Limiting
// ============================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Max 10 submissions per minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// ============================================
// POST - Create Resource
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Get client identifier for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Honeypot check (bot detection)
    if (body.website || body.email_confirm) {
      return NextResponse.json({ success: true, id: 'fake-id' });
    }

    // Validate with Zod
    const validationResult = resourceSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Create Supabase client with server-side auth
    const supabase = await createClient();

    // Get the authenticated user (optional - anonymous submissions allowed)
    const { data: { user } } = await supabase.auth.getUser();

    // Note: Stream validation is skipped because streams come from the config API
    // which already fetches valid streams from the database. The client auto-assigns
    // streams based on subject selection from the same config data.

    // Validate subject exists in database for the given level (soft validation)
    // This may fail if RLS policies aren't applied yet, so we log but don't block
    const { data: validSubject, error: subjectError } = await supabase
      .from('subjects')
      .select('code')
      .eq('code', validatedData.subject)
      .eq('level_code', validatedData.level)
      .single();

    if (subjectError) {
      // Log the error but continue - RLS might not be applied
      console.warn('Subject validation warning:', subjectError.message);
    }

    // Prepare base data
    const baseData = {
      title: validatedData.title,
      description: validatedData.description,
      url: validatedData.url,
      level: validatedData.level,
      stream: validatedData.stream,
      subject: validatedData.subject,
      language: validatedData.language,
      contributor_id: (!validatedData.isAnonymous && user) ? user.id : null,
      contributor_name: (!validatedData.isAnonymous && user)
        ? (user.user_metadata?.full_name || user.email)
        : null,
      is_anonymous: validatedData.isAnonymous || !user,
      status: (user && !validatedData.isAnonymous) ? 'approved' : 'pending',
    };

    let insertResult;

    if (validatedData.resourceType === 'material') {
      insertResult = await supabase
        .from('materials')
        .insert({
          ...baseData,
          category: validatedData.category,
        })
        .select('id')
        .single();
    } else {
      // Session-specific validation
      if (validatedData.sessionType === 'Live') {
        if (validatedData.sessionDate) {
          const sessionDate = new Date(validatedData.sessionDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (sessionDate < today) {
            return NextResponse.json(
              { error: 'Live session date must be in the future' },
              { status: 400 }
            );
          }
        }

        if (validatedData.startTime && !isValidTimeFormat(validatedData.startTime)) {
          return NextResponse.json(
            { error: 'Invalid start time format' },
            { status: 400 }
          );
        }
        if (validatedData.endTime && !isValidTimeFormat(validatedData.endTime)) {
          return NextResponse.json(
            { error: 'Invalid end time format' },
            { status: 400 }
          );
        }
      }

      insertResult = await supabase
        .from('sessions')
        .insert({
          ...baseData,
          session_type: validatedData.sessionType,
          session_date: validatedData.sessionType === 'Live' ? validatedData.sessionDate : null,
          start_time: validatedData.sessionType === 'Live' ? validatedData.startTime : null,
          end_time: validatedData.sessionType === 'Live' ? validatedData.endTime : null,
        })
        .select('id')
        .single();
    }

    if (insertResult.error) {
      console.error('Database insert error:', insertResult.error);
      return NextResponse.json(
        { error: 'Failed to save resource. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: insertResult.data.id,
      status: baseData.status,
      message: baseData.status === 'approved'
        ? 'Resource added successfully!'
        : 'Resource submitted for review.',
    });

  } catch (error) {
    console.error('Unexpected error in resource submission:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// ============================================
// GET - List Resources
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const level = searchParams.get('level');
    const stream = searchParams.get('stream');
    const subject = searchParams.get('subject');
    const language = searchParams.get('language');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const supabase = await createClient();
    const table = type === 'session' ? 'sessions' : 'materials';
    
    let query = supabase
      .from(table)
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (level) query = query.eq('level', level);
    if (stream) query = query.contains('stream', [stream]);
    if (subject) query = query.eq('subject', subject);
    if (language) query = query.eq('language', language);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching resources:', error);
      return NextResponse.json(
        { error: 'Failed to fetch resources' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    console.error('Unexpected error fetching resources:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
