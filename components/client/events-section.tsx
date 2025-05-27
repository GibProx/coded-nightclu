"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Clock, Music, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function EventsSection() {
  // Featured events data - in a real app, this would come from your database
  const featuredEvents = [
    {
      id: "e1",
      title: "Friday Night Live",
      date: "Fri, Nov 17",
      time: "10:00 PM - 4:00 AM",
      dj: "DJ Maxwell",
      image: "/images/gallery/event3.jpeg",
      external_ticketing: true,
      fatsoma_url: "https://www.fatsoma.com/events/friday-night-live",
      ticketing_provider: "fatsoma",
    },
    {
      id: "e2",
      title: "Saturday Night Fever",
      date: "Sat, Nov 18",
      time: "10:00 PM - 4:00 AM",
      dj: "DJ Electra",
      image: "/images/gallery/event4.jpeg",
      external_ticketing: true,
      fatsoma_url: "https://www.fatsoma.com/events/saturday-night-fever",
      ticketing_provider: "fatsoma",
    },
    {
      id: "e3",
      title: "Electronic Music Festival",
      date: "Fri, Dec 1",
      time: "8:00 PM - 6:00 AM",
      dj: "Multiple Artists",
      image: "/images/gallery/event7.jpeg",
      external_ticketing: true,
      fatsoma_url: "https://www.fatsoma.com/events/electronic-music-festival",
      ticketing_provider: "fatsoma",
    },
  ]

  const handleTicketClick = (event: any) => {
    if (event.external_ticketing && event.fatsoma_url) {
      // Open Fatsoma in a new tab
      window.open(event.fatsoma_url, "_blank", "noopener,noreferrer")
    } else {
      // Fallback to internal ticketing
      window.location.href = `/events/${event.id}`
    }
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold">Upcoming Events</h2>
        <Button variant="outline" asChild>
          <Link href="/events">View All Events</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden bg-card/60 backdrop-blur border-muted">
            <div className="relative h-48">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              {event.external_ticketing && (
                <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {event.ticketing_provider}
                </Badge>
              )}
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-muted-foreground">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Music className="mr-2 h-4 w-4" />
                  <span>{event.dj}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleTicketClick(event)}>
                  {event.external_ticketing ? (
                    <>
                      Get Tickets <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Get Tickets"
                  )}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/events/${event.id}`}>Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
