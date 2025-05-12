import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Clock, Music } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EventsPage() {
  // Events data
  const events = [
    {
      id: "e1",
      title: "Friday Night Live",
      date: "Fri, Nov 17",
      time: "10:00 PM - 4:00 AM",
      dj: "DJ Maxwell",
      description:
        "Start your weekend right with our signature Friday night event featuring DJ Maxwell spinning the best house and electronic music.",
      image: "/placeholder.svg?height=400&width=600",
      category: "weekly",
    },
    {
      id: "e2",
      title: "Saturday Night Fever",
      date: "Sat, Nov 18",
      time: "10:00 PM - 4:00 AM",
      dj: "DJ Electra",
      description:
        "The ultimate Saturday night experience with DJ Electra bringing you the hottest tracks and infectious beats all night long.",
      image: "/placeholder.svg?height=400&width=600",
      category: "weekly",
    },
    {
      id: "e3",
      title: "Electronic Music Festival",
      date: "Fri, Dec 1",
      time: "8:00 PM - 6:00 AM",
      dj: "Multiple Artists",
      description:
        "A night of non-stop electronic music featuring top DJs from around the world. This special event will showcase various electronic music styles.",
      image: "/placeholder.svg?height=400&width=600",
      category: "special",
    },
    {
      id: "e4",
      title: "Hip Hop Thursdays",
      date: "Thu, Nov 16",
      time: "9:00 PM - 3:00 AM",
      dj: "DJ Beats",
      description:
        "Every Thursday we bring you the best in hip hop, R&B, and trap music with our resident DJ Beats taking control of the decks.",
      image: "/placeholder.svg?height=400&width=600",
      category: "weekly",
    },
    {
      id: "e5",
      title: "New Year's Eve Celebration",
      date: "Sun, Dec 31",
      time: "9:00 PM - 6:00 AM",
      dj: "DJ Maxwell & Special Guests",
      description:
        "Ring in the New Year at Coded with our spectacular celebration featuring DJ Maxwell and special guest performances throughout the night.",
      image: "/placeholder.svg?height=400&width=600",
      category: "special",
    },
    {
      id: "e6",
      title: "Techno Tuesday",
      date: "Tue, Nov 21",
      time: "9:00 PM - 3:00 AM",
      dj: "DJ Synth",
      description:
        "Immerse yourself in the best techno beats every Tuesday with our resident DJ Synth taking you on a journey through techno's finest.",
      image: "/placeholder.svg?height=400&width=600",
      category: "weekly",
    },
  ]

  const weeklyEvents = events.filter((event) => event.category === "weekly")
  const specialEvents = events.filter((event) => event.category === "special")

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=800&width=1920"
            alt="Coded Events"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Check out our calendar of events and secure your tickets for an unforgettable night
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="all" className="space-y-8">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="special">Special</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {weeklyEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="special" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  )
}

function EventCard({ event }: { event: any }) {
  return (
    <Card className="overflow-hidden bg-card/60 backdrop-blur border-muted h-full flex flex-col">
      <div className="relative h-48">
        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
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
        <p className="text-muted-foreground text-sm mb-6 flex-1">{event.description}</p>
        <div className="flex gap-3 mt-auto">
          <Button className="flex-1" asChild>
            <Link href={`/events/${event.id}`}>Get Tickets</Link>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/events/${event.id}`}>Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
