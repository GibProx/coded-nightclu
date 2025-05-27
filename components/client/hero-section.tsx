import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/gallery/event5.jpeg"
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
            <Link href="/events">View Events</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/reservations">Reserve a Table</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
