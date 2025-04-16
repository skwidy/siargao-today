import { NextResponse } from 'next/server';
import { commentsTable, type Comment, getFieldValue } from '@/lib/airtable';
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

    console.log(`Found ${records.length} comment records`);

    const comments: Comment[] = records.map((record) => {
      // Log raw field values
      console.log(`Comment ID: ${record.id}`);
      console.log('Raw field values:');
      console.log(`- name: ${record.get('name')} (${typeof record.get('name')})`);
      console.log(`- comment: ${record.get('comment')} (${typeof record.get('comment')})`);
      console.log(`- rating: ${record.get('rating')} (${typeof record.get('rating')})`);
      console.log(`- instructorId: ${record.get('instructorId')} (${typeof record.get('instructorId')})`);
      console.log(`- eventId: ${record.get('eventId')} (${typeof record.get('eventId')})`);
      console.log(`- user_uid: ${record.get('user_uid')} (${typeof record.get('user_uid')})`);
      
      // Process fields with helper functions
      const comment: Comment = {
        id: record.id,
        name: getFieldValue(record, 'name', ''),
        comment: getFieldValue(record, 'comment', ''),
        rating: getFieldValue(record, 'rating', 0),
        instructorId: getFieldValue(record, 'instructorId', ''),
        eventId: getFieldValue(record, 'eventId', ''),
        user_uid: getFieldValue(record, 'user_uid', ''),
      };
      
      // Log processed values
      console.log('Processed values:');
      console.log(JSON.stringify(comment, null, 2));
      
      return comment;
    });

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