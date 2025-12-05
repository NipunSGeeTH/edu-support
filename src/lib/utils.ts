import { Stream } from '@/types/database';

/**
 * Safely parse stream data from the database.
 * Handles multiple formats:
 * - Proper arrays: ["Science", "Commerce"]
 * - Single string: "Science"
 * - PostgreSQL array format: "{Science,Commerce}"
 * 
 * This handles backward compatibility for databases where the stream
 * column may not yet be migrated to a proper array type.
 */
export function parseStreamArray(stream: unknown): Stream[] {
  if (!stream) return [];
  if (Array.isArray(stream)) return stream as Stream[];
  if (typeof stream === 'string') {
    // Handle PostgreSQL array format: "{Science,Commerce}"
    if (stream.startsWith('{') && stream.endsWith('}')) {
      const inner = stream.slice(1, -1);
      if (!inner) return [];
      return inner.split(',').map(s => s.trim().replace(/"/g, '')) as Stream[];
    }
    // Single value string
    return [stream as Stream];
  }
  return [];
}

/**
 * Format a time string (HH:MM:SS or HH:MM) to 12-hour format
 */
export function formatTime(time: string | null): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Format a date string to a user-friendly format
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}
