import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side)
if (getApps().length === 0) {
  // For production, use service account
  // For development, it will use application default credentials
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

// Validate phone number (Sri Lankan format)
function isValidPhoneNumber(phone: string): boolean {
  // Sri Lankan phone: 07X XXX XXXX or +947X XXX XXXX
  const phoneRegex = /^(?:\+94|0)?7[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Sanitize input
function sanitizeInput(input: string): string {
  return input.trim().slice(0, 1000); // Limit length and trim
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

    const body = await request.json();

    // Check honeypot field (should be empty)
    if (body.website) {
      // Bot detected - silently reject
      return NextResponse.json({ success: true }); // Fake success to confuse bots
    }

    // Validate required fields
    const { name, address, district, grade, school, phoneNumber, category, description } = body;

    if (!name || !address || !district || !grade || !school || !phoneNumber || !category || !description) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!isValidPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: 'Please enter a valid Sri Lankan phone number.' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['Books', 'Clothes', 'Stationery', 'Electronics', 'Other'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category selected.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      address: sanitizeInput(address),
      district: sanitizeInput(district),
      grade: sanitizeInput(grade),
      school: sanitizeInput(school),
      phoneNumber: sanitizeInput(phoneNumber),
      category: category,
      description: sanitizeInput(description),
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
