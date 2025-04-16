'use client';

import { useState } from 'react';
import { Instagram, MessageSquare, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

interface Instructor {
  id: string;
  name: string;
  tagline: string;
  status: 'Active' | 'Inactive' | 'Pending';
  rating: number;
  locations: string[];
  tags: string[];
  whatsapp: string;
  instagram: string;
}

interface InstructorsListProps {
  initialInstructors: Instructor[] | { error: string };
}

export default function InstructorsList({ initialInstructors }: InstructorsListProps) {
  const [instructors, setInstructors] = useState<Instructor[] | null>(
    Array.isArray(initialInstructors) ? initialInstructors : null
  );
  const [error, setError] = useState<string | null>(
    'error' in initialInstructors ? initialInstructors.error : null
  );

  // Optional: Fetch updates periodically or on user interaction
  async function refreshInstructors() {
    try {
      const response = await fetch('/api/instructors');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      
      if ('error' in data) {
        setError(data.error);
        setInstructors([]);
      } else {
        setInstructors(Array.isArray(data) ? data : []);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setError('Failed to fetch instructors');
      setInstructors([]);
    }
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (!instructors || instructors.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500 col-span-full">
        No instructors available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {instructors.map((instructor) => (
        <Link
          href={`/instructor/${instructor.id}`}
          key={instructor.id}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-gray-900">{instructor.name}</h3>
            {instructor.status === 'Active' && (
              <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                Available
              </span>
            )}
          </div>

          {instructor.tagline && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{instructor.tagline}</p>
          )}

          {instructor.rating > 0 && (
            <div className="mt-3 flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < instructor.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
          
          <div className="mt-3 flex flex-wrap gap-2">
            {instructor.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {instructor.locations.length > 0 && (
            <div className="mt-3 flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="line-clamp-1">{instructor.locations.join(', ')}</span>
            </div>
          )}

          <div className="mt-4 flex items-center space-x-4">
            {instructor.instagram && (
              <a
                href={`https://instagram.com/${instructor.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                <Instagram className="h-4 w-4" />
                <span className="ml-1 text-sm">{instructor.instagram}</span>
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
                <MessageSquare className="h-4 w-4" />
                <span className="ml-1 text-sm">WhatsApp</span>
              </a>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
} 