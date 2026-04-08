import type { TimeBlock } from '@/types';

/** Generate a unique ID using the Web Crypto API. */
export function generateId(): string {
  return crypto.randomUUID();
}

/** Conditionally join class names, filtering out falsy values. */
export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Format a Date object or date string as 'YYYY-MM-DD'. */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Return today's date as 'YYYY-MM-DD'. */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * Return an array of 7 date strings (Monday through Sunday) for the
 * ISO week that contains the given date.
 */
export function getWeekDates(date: string): string[] {
  const d = new Date(date + 'T12:00:00'); // noon to avoid DST edge cases
  const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon, ...
  // Shift so Monday = 0
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(d);
  monday.setDate(d.getDate() + mondayOffset);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    dates.push(formatDate(current));
  }
  return dates;
}

/** Return the current time-of-day block based on the hour. */
export function getTimeOfDay(): TimeBlock {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

/** Return a greeting string appropriate for the current time of day. */
export function getGreeting(name: string): string {
  const time = getTimeOfDay();
  switch (time) {
    case 'morning':
      return `Good morning, ${name}`;
    case 'afternoon':
      return `Good afternoon, ${name}`;
    case 'evening':
      return `Good evening, ${name}`;
  }
}

/** Return the full day name (e.g. 'Monday') for a 'YYYY-MM-DD' date string. */
export function getDayName(date: string): string {
  const d = new Date(date + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}
