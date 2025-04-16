import { NextResponse } from 'next/server';

export type InstructorStatus = 'Active' | 'Inactive' | 'Pending';

export interface Instructor {
  id: string;
  name: string;
  tagline: string;
  status: InstructorStatus;
  rating: number;
  locations: string[];
  tags: string[];
  whatsapp: string;
  instagram: string;
}

export async function GET() {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = 'Instructors';
    const apiKey = process.env.AIRTABLE_API_KEY;

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableId}?sort[0][field]=name&sort[0][direction]=asc`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    
    const instructors: Instructor[] = data.records.map((record: any) => ({
      id: record.id,
      name: record.fields.name || '',
      tagline: record.fields.tagline || '',
      status: record.fields.status || 'Pending',
      rating: Number(record.fields.rating) || 0,
      locations: Array.isArray(record.fields.locations) ? record.fields.locations : [],
      tags: Array.isArray(record.fields.tags) ? record.fields.tags : [],
      instagram: record.fields.instagram ? 
        record.fields.instagram.startsWith('@') ? 
          record.fields.instagram : 
          `@${record.fields.instagram.split('instagram.com/').pop()?.split('/')[0] || ''}` : 
        '',
      whatsapp: (record.fields.whatsapp || '').replace(/\D/g, ''),
    }));

    return NextResponse.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 });
  }
} 