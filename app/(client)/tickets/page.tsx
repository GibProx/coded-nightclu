import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin, Music } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TicketsPage() {
  // Sample upcoming events data
  const events = [
    {
      id: "e1",
      title: "Friday Night Live",
      date: "Fri, Nov 17",
      time: "10:00 PM - 4:00 AM",
      dj: "DJ Maxwell",
      image: "/placeholder.svg?height=400&width=600",
      ticketTypes: [
        { name: "General Admission", price: 15, available: true },
        { name: "VIP Entry", price: 30, available: true },
        { name: "Group (4+)", price: 50, available: true },
      ],
      featured: true,
    },
    {
      id: "e2",
      title: "Saturday Night Fever",
      date: "Sat, Nov 18",
      time: "10:00 PM - 4:00 AM",
      dj: "DJ Electra",
      image: "/placeholder.svg?height=400&width=600",
      ticketTypes: [
        { name: "General Admission", price: 20, available: true },
        { name: "VIP Entry", price: 40, available: true },
        { name: "Group (4+)", price: 70, available: true },
      ],
      featured: true,
    },
    {
      id: "e3",
      title: "Electronic Music Festival",
      date: "Fri, Dec 1",
      time: "8:00 PM - 6:00 AM",
      dj: "Multiple Artists",
      image: "/placeholder.svg?height=400&width=600",
      ticketTypes: [
        { name: "Early Bird", price: 25, available: false },
        { name: "General Admission", price: 35, available: true },
        { name: "VIP Entry", price: 60, available: true },
        { name: "Group (4+)", price: 120, available: true },
      ],
      featured: true,
    },
    {
      id: "e4",
      title: "Hip Hop Thursdays",
      date: "Thu, Nov 16",
      time: "9:00 PM - 3:00 AM",
      dj: "DJ Beats",
      image: "/placeholder.svg?height=400&width=600",
      ticketTypes: [
        { name: "General Admission", price: 12, available: true },
        { name: "VIP Entry", price: 25, available: true },
      ],
      featured: false,
    },
    {
      id: "e5",
      title: "New Year's Eve Celebration",
      date: "Sun, Dec 31",
      time: "9:00 PM - 6:00 AM",
      dj: "DJ Maxwell & Special Guests",
      image: "/placeholder.svg?height=400&width=600",
      ticketTypes: [
        { name: "Early Bird", price: 40, available: false },
        { name: "General Admission", price: 60, available: true },
        { name: "VIP Entry", price: 100, available: true },
        { name: "Group (4+)", price: 220, available: true },
      ],
      featured: true,
    },
  ]

  const featuredEvents = events.filter((event) => event.featured)
  const thisWeekEvents = events.filter((event) => ["Fri, Nov 17", "Sat, Nov 18", "Thu, Nov 16"].includes(event.date))
  const specialEvents = events.filter((event) =>
    ["Electronic Music Festival", "New Year's Eve Celebration"].includes(event.title),
  )

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=800&width=1920"
            alt="Buy Tickets"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Buy Tickets</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Secure your tickets for upcoming events at Coded Nightclub in Birmingham
          </p>
        </div>
      </section>

      {/* Tickets Section */}
      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="all" className="space-y-8">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="this-week">This Week</TabsTrigger>
              <TabsTrigger value="special">Special Events</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventTicketCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="this-week" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {thisWeekEvents.map((event) => (
                  <EventTicketCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="special" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialEvents.map((event) => (
                  <EventTicketCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  )
}

function EventTicketCard({ event }: { event: any }) {
  const lowestPrice = Math.min(...event.ticketTypes.filter((ticket) => ticket.available).map((ticket) => ticket.price))

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
        {event.ticketTypes.some((t) => !t.available) && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive">Limited Tickets</Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center text-muted-foreground mt-1">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-muted-foreground mt-1">
            <Clock className="mr-2 h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-muted-foreground mt-1">
            <Music className="mr-2 h-4 w-4" />
            <span>{event.dj}</span>
          </div>
          <div className="flex items-center text-muted-foreground mt-1">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Coded Nightclub, Birmingham</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">Available Tickets:</p>
          <ul className="text-sm text-muted-foreground">
            {event.ticketTypes.map((ticket, index) => (
              <li key={index} className="flex justify-between">
                <span>{ticket.name}</span>
                <span className={ticket.available ? "" : "line-through"}>£{ticket.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-2">
        <Button className="w-full" asChild>
          <Link href={`/tickets/${event.id}`}>Buy Tickets from £{lowestPrice.toFixed(2)}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
