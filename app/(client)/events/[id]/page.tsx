import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin, Music, Users, Ticket, Share2, Heart } from "lucide-react"
import { createServerActionClient } from "@/lib/supabase/server"

export const revalidate = 3600 // Revalidate this page every hour

async function getEventById(id: string) {
  const supabase = createServerActionClient()

  const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

  if (error || !data) {
    console.error("Error fetching event:", error)
    return null
  }

  return {
    ...data,
    ticket_categories: data.ticket_categories
      ? JSON.parse(data.ticket_categories)
      : [
          {
            name: "Standard Tickets",
            description: "Regular admission tickets",
            tickets: [
              { name: "General Admission", price: data.ticket_price, available: true },
              { name: "VIP Entry", price: data.ticket_price * 2, available: true },
              { name: "Table Reservation", price: data.ticket_price * 10, available: true },
            ],
          },
        ],
    gallery_images: data.gallery_images
      ? JSON.parse(data.gallery_images)
      : ["/images/gallery/event1.jpeg", "/images/gallery/event3.jpeg", "/images/gallery/event7.jpeg"],
  }
}

async function getRelatedEvents(currentId: string) {
  const supabase = createServerActionClient()

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .neq("id", currentId)
    .order("date", { ascending: true })
    .limit(2)

  if (error) {
    console.error("Error fetching related events:", error)
    return []
  }

  return data || []
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  const relatedEvents = await getRelatedEvents(params.id)

  // Format the date for display
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // Format the time for display
  const startTime = event.start_time
  const endTime = event.end_time
  const timeDisplay = `${startTime} - ${endTime}`

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] rounded-xl overflow-hidden mb-8">
        <Image
          src={event.main_image || "/placeholder.svg"}
          alt={event.name}
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent">
          <Badge className="mb-2 w-fit" variant="secondary">
            {event.status}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{event.name}</h1>
          <p className="text-white/80 max-w-3xl">{event.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="lineup">Lineup</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                  <CardDescription>Everything you need to know about {event.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Date</h3>
                        <p className="text-muted-foreground">{formattedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Time</h3>
                        <p className="text-muted-foreground">{timeDisplay}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="text-muted-foreground">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Capacity</h3>
                        <p className="text-muted-foreground">{event.capacity} people</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Music className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Music By</h3>
                        <p className="text-muted-foreground">{event.dj || "TBA"}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Ticket className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Starting From</h3>
                        <p className="text-muted-foreground">£{event.ticket_price}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">About This Event</h3>
                    <div className="text-muted-foreground whitespace-pre-line">
                      {event.long_description || event.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="gallery" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Gallery</CardTitle>
                  <CardDescription>Photos from previous {event.name} events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[event.main_image, ...(event.gallery_images || [])].map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${event.name} - Image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="lineup" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Lineup</CardTitle>
                  <CardDescription>Artists performing at this event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image src="/dj-at-turntables.png" alt="DJ" fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{event.dj || "Main DJ"}</h3>
                        <p className="text-muted-foreground">
                          Main Stage | {event.start_time} - {event.end_time}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Get Tickets</CardTitle>
              <CardDescription>Secure your spot at {event.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {event.ticket_categories.map((category: any, categoryIndex: number) => (
                <div key={categoryIndex} className="space-y-3">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    {category.description && <p className="text-xs text-muted-foreground">{category.description}</p>}
                  </div>

                  {category.tickets.map((ticket: any, ticketIndex: number) => (
                    <div key={ticketIndex} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{ticket.name}</h4>
                        <p className="text-sm text-muted-foreground">£{ticket.price}</p>
                      </div>
                      <Button size="sm" disabled={!ticket.available}>
                        {ticket.available ? "Buy" : "Sold Out"}
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full">Buy Tickets</Button>
              <div className="flex justify-between w-full">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEvents.map((relatedEvent) => (
              <Card key={relatedEvent.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={relatedEvent.main_image || "/placeholder.svg"}
                    alt={relatedEvent.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold">{relatedEvent.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {new Date(relatedEvent.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/events/${relatedEvent.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
