import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function AboutSection() {
  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">About Coded</h2>
          <p className="text-muted-foreground mb-4">
            Located in the heart of Birmingham, United Kingdom, Coded is a premier nightclub and events venue offering
            an unparalleled nightlife experience. Our state-of-the-art sound system, immersive lighting, and world-class
            DJs create the perfect atmosphere for unforgettable nights.
          </p>
          <p className="text-muted-foreground mb-6">
            Whether you're looking to dance the night away, celebrate a special occasion, or enjoy VIP bottle service,
            Coded provides the ultimate nightlife destination.
          </p>
          <Button variant="outline" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image src="/images/gallery/event1.jpeg" alt="Coded Nightclub Interior" fill className="object-cover" />
        </div>
      </div>
    </div>
  )
}
