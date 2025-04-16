import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventsList from '@/components/events/EventsList';
import InstructorsList from '@/components/instructors/InstructorsList';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Siargao Today</h1>
        <p className="mt-2 text-gray-600">Your daily guide to events and surf instructors</p>
      </header>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="instructors">Surf Instructors</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="mt-6">
          <EventsList />
        </TabsContent>
        <TabsContent value="instructors" className="mt-6">
          <InstructorsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
