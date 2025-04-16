import { NextResponse } from 'next/server';
import { eventsTable, type Event } from '@/lib/airtable';

export async function GET() {
  try {
    const records = await eventsTable
      .select({
        sort: [{ field: 'date', direction: 'asc' }],
        filterByFormula: "IS_SAME({date}, TODAY(), 'day')",
      })
      .firstPage();

    const events: Event[] = records.map((record) => ({
      id: record.id,
      name: record.get('name') as string,
      notes: record.get('notes') as string,
      status: record.get('status') as Event['status'],
      date: record.get('date') as string,
      location: record.get('location') as string,
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
} 