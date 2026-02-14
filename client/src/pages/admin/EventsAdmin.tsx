import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CalendarDays, Plus, Users, Clock, Video, Edit, Eye, BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function EventsAdmin() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const { data: eventsData, isLoading } = trpc.kajabiEventsAdmin.list.useQuery({});
  const { data: eventStats } = trpc.kajabiEventsAdmin.getStats.useQuery();

  const events = (eventsData as any)?.items ?? [];
  const upcoming = events.filter((e: any) => new Date(e.startAt || e.date) > new Date());
  const past = events.filter((e: any) => new Date(e.startAt || e.date) <= new Date());

  const stats = eventStats ?? { total: 0, upcoming: 0, totalRegistrations: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Events</h1><p className="text-sm text-muted-foreground">Manage workshops, webinars, and community events.</p></div>
        <Button size="sm" className="gap-1.5" onClick={() => toast("Create event coming soon")}><Plus className="h-4 w-4" /> New Event</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><CalendarDays className="h-5 w-5 text-red-600" /><div><p className="text-xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total Events</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="h-5 w-5 text-blue-600" /><div><p className="text-xl font-bold">{stats.upcoming}</p><p className="text-xs text-muted-foreground">Upcoming</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-5 w-5 text-green-600" /><div><p className="text-xl font-bold">{stats.totalRegistrations}</p><p className="text-xs text-muted-foreground">Registrations</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Video className="h-5 w-5 text-purple-600" /><div><p className="text-xl font-bold">{events.filter((e: any) => e.locationType === "virtual").length}</p><p className="text-xs text-muted-foreground">Virtual</p></div></CardContent></Card>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="upcoming">Upcoming</TabsTrigger><TabsTrigger value="past">Past</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList>
        <TabsContent value="upcoming" className="mt-4">
          {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div> : upcoming.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No upcoming events" description="Create events to engage your community with workshops, webinars, and networking sessions." actionLabel="Create Event" onAction={() => toast("Create event coming soon")} />
          ) : (
            <div className="space-y-3">{upcoming.map((event: any) => (
              <Card key={event.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-50 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-red-600 uppercase">{new Date(event.startAt || event.date).toLocaleDateString("en", { month: "short" })}</span>
                      <span className="text-lg font-bold text-red-600">{new Date(event.startAt || event.date).getDate()}</span>
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">{event.eventType || "workshop"}</Badge>
                        <Badge variant={event.locationType === "virtual" ? "default" : "secondary"} className="text-[10px]">{event.locationType || "virtual"}</Badge>
                        <span className="text-xs text-muted-foreground">{event.currentRegistrations || 0}/{event.maxCapacity || "∞"} registered</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Edit coming soon")}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Preview coming soon")}><Eye className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}</div>
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          {past.length === 0 ? <EmptyState icon={Clock} title="No past events" description="Completed events will appear here with attendance data." /> : (
            <div className="space-y-2">{past.map((event: any) => (
              <Card key={event.id}><CardContent className="p-3 flex items-center justify-between"><div><p className="text-sm font-medium">{event.title}</p><p className="text-xs text-muted-foreground">{new Date(event.startAt || event.date).toLocaleDateString()}</p></div><Badge variant="secondary">{event.currentRegistrations || 0} attended</Badge></CardContent></Card>
            ))}</div>
          )}
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <EmptyState icon={BarChart3} title="Event Analytics" description="Track registration rates, attendance, and engagement across all events." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
