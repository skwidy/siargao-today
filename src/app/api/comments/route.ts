import { NextResponse } from 'next/server';
import { commentsTable, type Comment } from '@/lib/airtable';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instructorId = searchParams.get('instructorId');
    const eventId = searchParams.get('eventId');

    let filterFormula = '';
    if (instructorId) {
      filterFormula = `{instructorId} = '${instructorId}'`;
    } else if (eventId) {
      filterFormula = `{eventId} = '${eventId}'`;
    }

    const records = await commentsTable
      .select({
        sort: [{ field: 'created_at', direction: 'desc' }],
        ...(filterFormula && { filterByFormula: filterFormula }),
      })
      .firstPage();

    const comments: Comment[] = records.map((record) => ({
      id: record.id,
      name: record.get('name') as string,
      comment: record.get('comment') as string,
      rating: record.get('rating') as number,
      instructorId: record.get('instructorId') as string,
      eventId: record.get('eventId') as string,
      user_uid: record.get('user_uid') as string,
    }));

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, comment, rating, instructorId, eventId } = body;

    if (!name || !comment || !rating || (!instructorId && !eventId)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const record = await commentsTable.create([
      {
        fields: {
          name,
          comment,
          rating,
          instructorId,
          eventId,
          user_uid: userId,
        },
      },
    ]);

    return NextResponse.json(record[0]);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
} 