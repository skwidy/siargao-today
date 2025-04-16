import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventsList from '@/components/events/EventsList';
import InstructorsList from '@/components/instructors/InstructorsList';
import Image from 'next/image';
import { Suspense } from 'react';

// Mark the page as dynamic
export const dynamic = 'force-dynamic';

async function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

async function getInstructors() {
  try {
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/api/instructors`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return { error: 'Failed to fetch instructors' };
  }
}

async function getEvents() {
  try {
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/api/events`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return { error: 'Failed to fetch events' };
  }
}

export default async function Home() {
  const [instructorsData, eventsData] = await Promise.all([
    getInstructors(),
    getEvents()
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[90vh] w-full overflow-hidden">
        <Image
          src="/hero-siargao.png"
          alt="Siargao Island Paradise"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <div className="max-w-4xl w-full text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)] [text-shadow:_2px_2px_8px_rgb(0_0_0_/_40%)]">
              Welcome to Siargao
            </h1>
            <p className="text-xl md:text-3xl font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] [text-shadow:_1px_1px_4px_rgb(0_0_0_/_30%)] bg-black/10 backdrop-blur-sm py-4 px-6 rounded-2xl">
              Discover the perfect wave, join exciting events, and connect with professional surf instructors on the surfing capital of the Philippines
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container py-16 relative">
        <div className="max-w-2xl mx-auto backdrop-blur-sm bg-background/90 rounded-xl p-8 shadow-xl -mt-20">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Siargao Today</h2>
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="instructors">Surf Instructors</TabsTrigger>
            </TabsList>
            <Suspense fallback={
              <div className="space-y-4 animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            }>
              <TabsContent value="events" className="mt-2">
                <EventsList initialEvents={eventsData} />
              </TabsContent>
              <TabsContent value="instructors" className="mt-2">
                <InstructorsList initialInstructors={instructorsData} />
              </TabsContent>
            </Suspense>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
