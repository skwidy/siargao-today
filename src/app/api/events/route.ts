import { NextResponse } from 'next/server';
import { 
  eventsTable, 
  type Event, 
  type EventStatus, 
  getFieldValue, 
  getDateField, 
  getSingleSelectField 
} from '@/lib/airtable';

export async function GET() {
  try {
    const records = await eventsTable
      .select({
        sort: [{ field: 'date', direction: 'asc' }]
      })
      .firstPage();

    console.log(`Found ${records.length} event records`);

    const eventStatusOptions: EventStatus[] = ['Upcoming', 'Completed', 'Cancelled'];

    const events: Event[] = records.map((record) => {
      // Log raw field values
      console.log(`Event ID: ${record.id}`);
      console.log('Raw field values:');
      console.log(`- name: ${record.get('name')} (${typeof record.get('name')})`);
      console.log(`- notes: ${record.get('notes')} (${typeof record.get('notes')})`);
      console.log(`- status: ${record.get('status')} (${typeof record.get('status')})`);
      console.log(`- date: ${record.get('date')} (${typeof record.get('date')})`);
      console.log(`- location: ${record.get('location')} (${typeof record.get('location')})`);
      
      // Process fields with helper functions
      const event: Event = {
        id: record.id,
        name: getFieldValue(record, 'name', ''),
        notes: getFieldValue(record, 'notes', ''),
        status: getSingleSelectField(record, 'status', eventStatusOptions),
        date: getDateField(record, 'date'),
        location: getFieldValue(record, 'location', ''),
      };
      
      // Log processed values
      console.log('Processed values:');
      console.log(JSON.stringify(event, null, 2));
      
      return event;
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
} 