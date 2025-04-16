import { NextResponse } from 'next/server';
import { instructorsTable } from '@/lib/airtable';

export async function GET() {
  try {
    const records = await instructorsTable
      .select({
        sort: [{ field: 'name', direction: 'asc' }],
      })
      .firstPage();

    const instructors = records.map((record) => ({
      id: record.id,
      name: record.get('name'),
      instagram: record.get('instagram'),
      whatsapp: record.get('whatsapp'),
      tags: record.get('tags') as string[],
    }));

    return NextResponse.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 });
  }
} 