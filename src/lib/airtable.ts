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
export interface Instructor {
  id: string;
  name: string;
  tagline: string;
  status: 'Active' | 'Inactive' | 'Pending';
  rating: number;
  locations: string[];
  tags: string[];
}

export interface Event {
  id: string;
  name: string;
  notes: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  date: string;
  location: string;
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