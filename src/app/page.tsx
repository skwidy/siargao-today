import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventsList from '@/components/events/EventsList';
import InstructorsList from '@/components/instructors/InstructorsList';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Home() {
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
            <TabsContent value="events" className="mt-2">
              <EventsList />
            </TabsContent>
            <TabsContent value="instructors" className="mt-2">
              <InstructorsList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
