import Airtable from 'airtable';

if (!process.env.AIRTABLE_API_KEY) {
  throw new Error('Missing AIRTABLE_API_KEY');
}

if (!process.env.AIRTABLE_BASE_ID) {
  throw new Error('Missing AIRTABLE_BASE_ID');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Tables
export const eventsTable = base('Events');
export const instructorsTable = base('Instructors');
export const commentsTable = base('Comments');

// Types
export type InstructorStatus = 'Active' | 'Inactive' | 'Pending';

export interface Instructor {
  id: string;
  name: string; // Text
  tagline: string; // Text (description)
  status: InstructorStatus; // Select
  rating: number; // Rating
  locations: string[]; // Multiple select
  tags: string[]; // Multiple select
  whatsapp: string; // Phone
  instagram: string; // URL
}

// Event status options
export type EventStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface Event {
  id: string;
  name: string; // Single line text
  notes: string; // Text
  status: EventStatus; // Single select
  date: string; // Date
  location: string; // Text
}

// Helper function to safely get field values from Airtable records
export function getFieldValue<T>(record: any, fieldName: string, defaultValue: T): T {
  const value = record.get(fieldName);
  return value !== undefined && value !== null ? value : defaultValue;
}

// Helper function to get date field from Airtable
export function getDateField(record: any, fieldName: string): string {
  const dateValue = record.get(fieldName);
  return dateValue ? dateValue : '';
}

// Helper function to get single select field from Airtable
export function getSingleSelectField<T extends string>(record: any, fieldName: string, options: T[]): T {
  const value = record.get(fieldName);
  return options.includes(value as T) ? value as T : options[0];
}

// Helper function to get multiple select field from Airtable
export function getMultipleSelectField<T extends string>(record: any, fieldName: string, options: T[]): T[] {
  const values = record.get(fieldName) || [];
  return Array.isArray(values) ? values.filter((value: any) => options.includes(value as T)) : [];
}

// Helper function to get rating field from Airtable
export function getRatingField(record: any, fieldName: string): number {
  const ratingValue = record.get(fieldName);
  return typeof ratingValue === 'number' ? ratingValue : 0;
}

export interface Comment {
  id: string;
  name: string;
  comment: string;
  rating: number;
  instructorId: string;
  eventId: string;
  user_uid: string;
}

// Helper function to get Instagram handle from URL
export function getInstagramHandle(record: any, fieldName: string): string {
  const url = record.get(fieldName);
  if (!url) return '';
  
  // Handle both URL and handle formats
  if (url.includes('instagram.com/')) {
    return '@' + url.split('instagram.com/').pop()?.split('/')[0] || '';
  }
  return url.startsWith('@') ? url : '@' + url;
}

// Helper function to format WhatsApp number
export function getWhatsAppNumber(record: any, fieldName: string): string {
  const number = record.get(fieldName);
  return number ? number.replace(/\D/g, '') : '';
} 