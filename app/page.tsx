import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Clock, MapPin, Music, Users } from "lucide-react"

export default function HomePage() {
  // Featured events data
  const featuredEvents = [
    {
      id: "e1",
      title: "Friday Night Live",
      date: "Fri, Nov 17",
      time: "10:00 PM - 4:00 AM",
      dj: "DJ Maxwell",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "e2",
      title: "Saturday Night Fever",
      date: "Sat, Nov 18",
      time: "10:00 PM - 4:00 AM",
      dj: "DJ Electra",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "e3",
      title: "Electronic Music Festival",
      date: "Fri, Dec 1",
      time: "8:00 PM - 6:00 AM",
      dj: "Multiple Artists",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Coded Nightclub"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Experience the Ultimate Nightlife</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300">
            Birmingham's premier nightclub destination for unforgettable nights and exclusive events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/tickets">Buy Tickets</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/reservations">Reserve a Table</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-black">
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
      </section>

      {/* About Section */}
      <section className="py-16 bg-gradient-to-b from-black to-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">About Coded</h2>
              <p className="text-muted-foreground mb-4">
                Located in the heart of Birmingham, United Kingdom, Coded is a premier nightclub and events venue
                offering an unparalleled nightlife experience. Our state-of-the-art sound system, immersive lighting,
                and world-class DJs create the perfect atmosphere for unforgettable nights.
              </p>
              <p className="text-muted-foreground mb-6">
                Whether you're looking to dance the night away, celebrate a special occasion, or enjoy VIP bottle
                service, Coded provides the ultimate nightlife destination.
              </p>
              <Button variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Coded Nightclub Interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Experience Coded</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">World-Class DJs</h3>
              <p className="text-muted-foreground">
                Experience performances from internationally renowned DJs and artists.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">VIP Experience</h3>
              <p className="text-muted-foreground">
                Enjoy exclusive VIP areas with bottle service and dedicated staff.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Prime Location</h3>
              <p className="text-muted-foreground">
                Located in the heart of Birmingham, easily accessible from anywhere in the city.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Regular Events</h3>
              <p className="text-muted-foreground">Weekly themed nights and special events throughout the year.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for an Unforgettable Night?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join us at Coded for an experience like no other. Book your tickets now or reserve a VIP table for your next
            night out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/tickets">Buy Tickets</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/reservations">Reserve a Table</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
