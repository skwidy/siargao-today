import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// In-memory storage for MVP
const comments = new Map<string, Array<{
  id: string;
  text: string;
  authorName: string;
  createdAt: string;
}>>();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const instructorComments = comments.get(params.id) || [];
  return NextResponse.json(instructorComments);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { text, authorName } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'Comment text is required' },
        { status: 400 }
      );
    }

    const newComment = {
      id: Math.random().toString(36).substring(7),
      text,
      authorName,
      createdAt: new Date().toISOString(),
    };

    const instructorComments = comments.get(params.id) || [];
    comments.set(params.id, [...instructorComments, newComment]);

    return NextResponse.json(newComment);
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 }
    );
  }
} 