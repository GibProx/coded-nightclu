import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GalleryPage() {
  // Sample gallery images
  const images = {
    venue: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=800&width=600",
    ],
    events: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=800&width=600",
    ],
    vip: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=800&width=600",
    ],
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=800&width=1920"
            alt="Gallery"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Take a visual tour of our venue, events, and unforgettable moments
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="venue" className="space-y-8">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
              <TabsTrigger value="venue">The Venue</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="vip">VIP Experience</TabsTrigger>
            </TabsList>

            <TabsContent value="venue" className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Our Venue</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.venue.map((image, index) => (
                  <GalleryImage key={index} src={image} alt={`Venue - ${index + 1}`} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Events & Performances</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.events.map((image, index) => (
                  <GalleryImage key={index} src={image} alt={`Event - ${index + 1}`} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vip" className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">VIP Experience</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.vip.map((image, index) => (
                  <GalleryImage key={index} src={image} alt={`VIP - ${index + 1}`} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  )
}

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square group overflow-hidden rounded-md">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span className="text-white font-medium">{alt}</span>
      </div>
    </div>
  )
}
