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

export default function EventsList() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEvents() {
      try {
        const response = await fetch('/api/events', {
          signal: controller.signal
        });
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          setEvents([]);
        } else {
          setEvents(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return; // Ignore abort errors
        }
        console.error('Error fetching events:', error);
        setError('Failed to fetch events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading || !events) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
            </div>
          </div>
        ))}
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

  if (events.length === 0) {
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