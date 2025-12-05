import { z } from 'zod';

// ============================================
// Common Validation Rules
// ============================================

export const ALLOWED_URL_DOMAINS = [
  'youtube.com',
  'youtu.be',
  'drive.google.com',
  'docs.google.com',
  'dropbox.com',
  'mega.nz',
  'mediafire.com',
  'onedrive.live.com',
  '1drv.ms',
  'github.com',
  'githubusercontent.com',
  'notion.so',
  'notion.site',
  'canva.com',
  'slideshare.net',
  'scribd.com',
  'archive.org',
  'zoom.us',
  'meet.google.com',
  'teams.microsoft.com',
];

// ============================================
// Sanitization Functions
// ============================================

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .slice(0, 2000);
}

export function sanitizeUrl(url: string): string {
  return url.trim().slice(0, 500);
}

// ============================================
// Validation Functions
// ============================================

export function isValidResourceUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return false;
    }
    
    return ALLOWED_URL_DOMAINS.some((domain) =>
      hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  return timeRegex.test(time);
}

export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Sri Lankan phone number validation
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(?:\+94|0)?7[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// ============================================
// Zod Schemas
// ============================================

// Use simple enum without errorMap for newer zod versions
export const levelSchema = z.enum(['AL', 'OL']);
export const languageSchema = z.enum(['Sinhala', 'Tamil', 'English']);
export const materialCategorySchema = z.enum(['Past Paper', 'Note', 'Textbook', 'Model Paper']);
export const sessionTypeSchema = z.enum(['Live', 'Recording']);
export const donationCategorySchema = z.enum(['Books', 'Clothes', 'Stationery', 'Electronics', 'Other']);

export const titleSchema = z
  .string()
  .min(3, 'Title must be at least 3 characters')
  .max(200, 'Title must be less than 200 characters')
  .transform(sanitizeInput);

export const descriptionSchema = z
  .string()
  .min(10, 'Description must be at least 10 characters')
  .max(2000, 'Description must be less than 2000 characters')
  .transform(sanitizeInput);

export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(500, 'URL too long')
  .refine(isValidResourceUrl, {
    message: 'URL must be from an allowed domain (YouTube, Google Drive, Dropbox, etc.)',
  });

export const subjectSchema = z
  .string()
  .min(1, 'Subject is required')
  .max(100, 'Subject name too long')
  .transform(sanitizeInput);

export const streamArraySchema = z
  .array(z.string())
  .min(1, 'At least one stream is required');

// Base resource schema
export const baseResourceSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  url: urlSchema,
  level: levelSchema,
  subject: subjectSchema,
  language: languageSchema,
  stream: streamArraySchema,
  isAnonymous: z.boolean().default(false),
});

// Material schema
export const materialSchema = baseResourceSchema.extend({
  resourceType: z.literal('material'),
  category: materialCategorySchema,
});

// Session schema
export const sessionSchema = baseResourceSchema.extend({
  resourceType: z.literal('session'),
  sessionType: sessionTypeSchema,
  sessionDate: z.string().nullable().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
});

// Combined resource schema
export const resourceSchema = z.discriminatedUnion('resourceType', [
  materialSchema,
  sessionSchema,
]);

// Donation request schema
export const donationRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .transform(sanitizeInput),
  address: z
    .string()
    .min(10, 'Please provide a complete address')
    .max(500, 'Address too long')
    .transform(sanitizeInput),
  district: z
    .string()
    .min(2, 'District is required')
    .max(50, 'District name too long')
    .transform(sanitizeInput),
  grade: z
    .string()
    .min(1, 'Grade is required')
    .max(20, 'Grade too long')
    .transform(sanitizeInput),
  school: z
    .string()
    .min(3, 'School name must be at least 3 characters')
    .max(200, 'School name too long')
    .transform(sanitizeInput),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, {
      message: 'Please enter a valid Sri Lankan phone number',
    }),
  category: donationCategorySchema,
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description too long')
    .transform(sanitizeInput),
});

// ============================================
// Type exports
// ============================================

export type ResourceInput = z.infer<typeof resourceSchema>;
export type MaterialInput = z.infer<typeof materialSchema>;
export type SessionInput = z.infer<typeof sessionSchema>;
export type DonationRequestInput = z.infer<typeof donationRequestSchema>;
