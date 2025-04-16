'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  time: string;
  location: string;
}

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          setEvents([]);
        } else {
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to fetch events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
          <div className="mt-2 space-y-2">
            <div className="flex items-center text-gray-600">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      ))}
      
      {events.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No events scheduled for today
        </div>
      )}
    </div>
  );
} 