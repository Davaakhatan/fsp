import { format, parseISO, addHours, isBefore, isAfter } from 'date-fns';

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, formatString = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatString);
}

/**
 * Format a time for display
 */
export function formatTime(date: Date | string, formatString = 'h:mm a'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatString);
}

/**
 * Format a datetime for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

/**
 * Check if a date is within the specified hours from now
 */
export function isWithinHours(date: Date | string, hours: number): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const cutoff = addHours(new Date(), hours);
  return isBefore(d, cutoff) && isAfter(d, new Date());
}

/**
 * Get relative time string (e.g., "in 2 hours", "2 days ago")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((d.getTime() - now.getTime()) / 1000);
  
  if (diffInSeconds < 0) {
    // Past
    const absDiff = Math.abs(diffInSeconds);
    if (absDiff < 60) return 'just now';
    if (absDiff < 3600) return `${Math.floor(absDiff / 60)}m ago`;
    if (absDiff < 86400) return `${Math.floor(absDiff / 3600)}h ago`;
    return `${Math.floor(absDiff / 86400)}d ago`;
  } else {
    // Future
    if (diffInSeconds < 60) return 'in a moment';
    if (diffInSeconds < 3600) return `in ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `in ${Math.floor(diffInSeconds / 3600)}h`;
    return `in ${Math.floor(diffInSeconds / 86400)}d`;
  }
}

/**
 * Utility to combine class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

