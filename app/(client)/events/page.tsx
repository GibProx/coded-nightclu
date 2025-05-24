import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { createServerActionClient } from "@/lib/supabase/server"

export const revalidate = 3600 // Revalidate this page every hour

async function getEvents() {
  const supabase = createServerActionClient()

  const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data || []
}

export default async function EventsPage() {
  const events = await getEvents()

  // Group events by status
  const upcomingEvents = events.filter((event) => event.status !== "Completed" && event.status !== "Cancelled")

  const pastEvents = events.filter((event) => event.status === "Completed")

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join us for unforgettable nights of music, dancing, and entertainment at Coded Nightclub.
        </p>
      </div>

      {upcomingEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-48">
                <Image src={event.main_image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge variant={event.status === "Sold Out" ? "destructive" : "secondary"}>{event.status}</Badge>
                </div>
              </div>
              <CardContent className="pt-6 flex-grow">
                <h2 className="text-xl font-bold mb-2">{event.name}</h2>
                <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {event.start_time} - {event.end_time}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-6">
                <Button asChild className="w-full">
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {pastEvents.length > 0 && (
        <>
          <div className="text-center mb-12 mt-16">
            <h2 className="text-3xl font-bold mb-4">Past Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take a look at some of our previous events at Coded Nightclub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.slice(0, 3).map((event) => (
              <Card key={event.id} className="overflow-hidden flex flex-col h-full bg-muted/30">
                <div className="relative h-48">
                  <Image
                    src={event.main_image || "/placeholder.svg"}
                    alt={event.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline">Past Event</Badge>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-2">{event.name}</h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center text-sm">
                    <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
