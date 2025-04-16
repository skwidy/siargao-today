import { NextResponse } from 'next/server';
import { instructorsTable, type Instructor } from '@/lib/airtable';

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

    const instructor: Instructor = {
      id: record.id,
      name: record.get('name') as string,
      tagline: record.get('tagline') as string,
      status: record.get('status') as Instructor['status'],
      rating: record.get('rating') as number,
      locations: record.get('locations') as string[],
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