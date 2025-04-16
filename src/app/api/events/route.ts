import { NextResponse } from 'next/server';

export type EventStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface Event {
  id: string;
  name: string;
  notes: string;
  status: EventStatus;
  date: string;
  location: string;
}

export async function GET() {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = 'Events';
    const apiKey = process.env.AIRTABLE_API_KEY;

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableId}?sort[0][field]=date&sort[0][direction]=asc`,
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
    
    const events: Event[] = data.records.map((record: any) => ({
      id: record.id,
      name: record.fields.name || '',
      notes: record.fields.notes || '',
      status: record.fields.status || 'Upcoming',
      date: record.fields.date || new Date().toISOString(),
      location: record.fields.location || '',
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
} 