'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  notes?: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

interface EventsListProps {
  initialEvents: Event[] | { error: string };
}

export default function EventsList({ initialEvents }: EventsListProps) {
  const [events, setEvents] = useState<Event[] | null>(
    Array.isArray(initialEvents) ? initialEvents : null
  );
  const [error, setError] = useState<string | null>(
    'error' in initialEvents ? initialEvents.error : null
  );

  // Optional: Fetch updates periodically or on user interaction
  async function refreshEvents() {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      
      if ('error' in data) {
        setError(data.error);
        setEvents([]);
      } else {
        setEvents(Array.isArray(data) ? data : []);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events');
      setEvents([]);
    }
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500">
        No events scheduled for today
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">{event.name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              event.status === 'Upcoming' ? 'bg-green-100 text-green-800' :
              event.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {event.status}
            </span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>{new Date(event.date).toLocaleString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
            {event.notes && (
              <p className="text-sm text-gray-600 mt-2">{event.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 