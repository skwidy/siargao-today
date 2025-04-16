import { NextResponse } from 'next/server';
import { instructorsTable } from '@/lib/airtable';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await instructorsTable.find(params.id);

    if (!record) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    const instructor = {
      id: record.id,
      name: record.get('name'),
      instagram: record.get('instagram'),
      whatsapp: record.get('whatsapp'),
      tags: record.get('tags') as string[],
    };

    return NextResponse.json(instructor);
  } catch (error) {
    console.error('Error fetching instructor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructor' },
      { status: 500 }
    );
  }
} 