import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { donationRequestSchema } from '@/lib/validation';

// Initialize Firebase Admin (server-side)
if (getApps().length === 0) {
  try {
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error('Firebase admin init error:', error);
  }
}

const db = getFirestore();

// Rate limiting: Store submission timestamps per IP
const submissionCache = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 3; // Max 3 submissions per hour per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const submissions = submissionCache.get(ip) || [];
  
  // Filter out old submissions
  const recentSubmissions = submissions.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );
  
  submissionCache.set(ip, recentSubmissions);
  
  return recentSubmissions.length >= MAX_SUBMISSIONS_PER_WINDOW;
}

function recordSubmission(ip: string): void {
  const submissions = submissionCache.get(ip) || [];
  submissions.push(Date.now());
  submissionCache.set(ip, submissions);
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Check honeypot field (should be empty)
    if (body.website || body.email_confirm) {
      // Bot detected - silently reject with fake success
      return NextResponse.json({ success: true });
    }

    // Validate with Zod schema
    const validationResult = donationRequestSchema.safeParse(body);
    
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

    // Prepare sanitized data for storage
    const sanitizedData = {
      name: validatedData.name,
      address: validatedData.address,
      district: validatedData.district,
      grade: validatedData.grade,
      school: validatedData.school,
      phoneNumber: validatedData.phoneNumber,
      category: validatedData.category,
      description: validatedData.description,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      submittedFromIp: ip, // For abuse tracking
    };

    // Save to Firestore
    const docRef = await db.collection('donationRequests').add(sanitizedData);

    // Record successful submission for rate limiting
    recordSubmission(ip);

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      message: 'Request submitted successfully!' 
    });

  } catch (error) {
    console.error('Error processing donation request:', error);
    return NextResponse.json(
      { error: 'Failed to submit request. Please try again.' },
      { status: 500 }
    );
  }
}
