'use client';

import { useEffect, useState } from 'react';
import { Instagram, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface Instructor {
  id: string;
  name: string;
  instagram: string;
  whatsapp: string;
  tags: string[];
}

interface Comment {
  id: string;
  text: string;
  authorName: string;
  createdAt: string;
}

export default function InstructorProfile() {
  const { id } = useParams();
  const { user, isSignedIn } = useUser();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchInstructor() {
      try {
        const response = await fetch(`/api/instructors/${id}`, {
          signal: controller.signal
        });
        const data = await response.json();
        setInstructor(data);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return; // Ignore abort errors
        }
        console.error('Error fetching instructor:', error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchComments() {
      try {
        const response = await fetch(`/api/instructors/${id}/comments`, {
          signal: controller.signal
        });
        const data = await response.json();
        setComments(data);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return; // Ignore abort errors
        }
        console.error('Error fetching comments:', error);
      }
    }

    fetchInstructor();
    fetchComments();

    return () => {
      controller.abort();
    };
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isSignedIn) return;

    try {
      const response = await fetch(`/api/instructors/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newComment,
          authorName: user?.fullName || 'Anonymous',
        }),
      });

      const data = await response.json();
      setComments([...comments, data]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Instructor not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to list
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">{instructor.name}</h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {instructor.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center space-x-4">
          {instructor.instagram && (
            <a
              href={`https://instagram.com/${instructor.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Instagram className="h-5 w-5 mr-2" />
              <span>@{instructor.instagram}</span>
            </a>
          )}
          {instructor.whatsapp && (
            <a
              href={`https://wa.me/${instructor.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments</h2>

          {isSignedIn ? (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Leave a comment..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!newComment.trim()}
              >
                Post Comment
              </button>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">Please sign in to leave a comment</p>
            </div>
          )}

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-900">{comment.authorName}</span>
                  <span className="text-sm text-gray-500">{comment.createdAt}</span>
                </div>
                <p className="mt-2 text-gray-600">{comment.text}</p>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No comments yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 