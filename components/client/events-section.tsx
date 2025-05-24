import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Clock, Music } from "lucide-react"

export function EventsSection() {
  // Featured events data
  const featuredEvents = [
    {
      id: "e1",
      title: "Friday Night Live",
      date: "Fri, Nov 17",
      time: "10:00 PM - 4:00 AM",
      dj: "DJ Maxwell",
      image: "/images/gallery/event3.jpeg",
    },
    {
      id: "e2",
      title: "Saturday Night Fever",
      date: "Sat, Nov 18",
      time: "10:00 PM - 4:00 AM",
      dj: "DJ Electra",
      image: "/images/gallery/event4.jpeg",
    },
    {
      id: "e3",
      title: "Electronic Music Festival",
      date: "Fri, Dec 1",
      time: "8:00 PM - 6:00 AM",
      dj: "Multiple Artists",
      image: "/images/gallery/event7.jpeg",
    },
  ]

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
              <Button className="w-full" asChild>
                <Link href={`/events/${event.id}`}>Get Tickets</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
