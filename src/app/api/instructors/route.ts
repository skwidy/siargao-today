import { NextResponse } from 'next/server';
import { instructorsTable, type Instructor } from '@/lib/airtable';

export async function GET() {
  try {
    const records = await instructorsTable
      .select({
        sort: [{ field: 'name', direction: 'asc' }],
      })
      .firstPage();

    const instructors: Instructor[] = records.map((record) => ({
      id: record.id,
      name: record.get('name') as string,
      tagline: record.get('tagline') as string,
      status: record.get('status') as Instructor['status'],
      rating: record.get('rating') as number,
      locations: record.get('locations') as string[],
      tags: record.get('tags') as string[],
    }));

    return NextResponse.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 });
  }
} 