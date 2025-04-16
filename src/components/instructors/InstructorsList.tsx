'use client';

import { useEffect, useState } from 'react';
import { Instagram, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface Instructor {
  id: string;
  name: string;
  instagram: string;
  whatsapp: string;
  tags: string[];
}

export default function InstructorsList() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstructors() {
      try {
        const response = await fetch('/api/instructors');
        const data = await response.json();
        setInstructors(data);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInstructors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {instructors.map((instructor) => (
        <Link
          href={`/instructor/${instructor.id}`}
          key={instructor.id}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900">{instructor.name}</h3>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {instructor.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center space-x-4">
            {instructor.instagram && (
              <a
                href={`https://instagram.com/${instructor.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {instructor.whatsapp && (
              <a
                href={`https://wa.me/${instructor.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageSquare className="h-5 w-5" />
              </a>
            )}
          </div>
        </Link>
      ))}

      {instructors.length === 0 && (
        <div className="text-center py-8 text-gray-500 col-span-full">
          No instructors available
        </div>
      )}
    </div>
  );
} 