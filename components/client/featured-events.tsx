"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FeaturedEvents() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = [
    "/images/gallery/event5.jpeg",
    "/images/gallery/event7.jpeg",
    "/images/gallery/event1.jpeg",
    "/images/gallery/event3.jpeg",
    "/images/gallery/event4.jpeg",
  ]

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <section className="py-16 bg-black">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Events</h2>

        <div className="relative overflow-hidden rounded-lg">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {images.map((image, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000",
                  index === currentIndex ? "opacity-100" : "opacity-0",
                )}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Featured event ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border-none text-white rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous slide</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border-none text-white rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next slide</span>
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentIndex ? "bg-white" : "bg-white/50",
                )}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg max-w-3xl mx-auto mb-6">
            Experience the energy and excitement of our exclusive events at Coded Nightclub. Join us for unforgettable
            nights with world-class DJs, performers, and an electric atmosphere.
          </p>
          <Button asChild className="bg-pink-600 hover:bg-pink-700">
            <a href="/events">View All Events</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
