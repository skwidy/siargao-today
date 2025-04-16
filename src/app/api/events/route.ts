import { NextResponse } from 'next/server';
import { eventsTable } from '@/lib/airtable';

export async function GET() {
  try {
    const records = await eventsTable
      .select({
        sort: [{ field: 'time', direction: 'asc' }],
        filterByFormula: "IS_SAME({date}, TODAY(), 'day')",
      })
      .firstPage();

    const events = records.map((record) => ({
      id: record.id,
      name: record.get('name'),
      time: record.get('time'),
      location: record.get('location'),
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
} 