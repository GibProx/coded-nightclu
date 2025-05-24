import Image from "next/image"
import { Button } from "@/components/ui/button"

export function PromoSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-900 to-purple-900">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pretty Girls Love Coded</h2>
            <p className="text-lg mb-6">
              Join our exclusive events and experience the ultimate nightlife atmosphere. Our "Pretty Girls Love Coded"
              nights are legendary in the city, featuring special performances, VIP bottle service, and unforgettable
              memories.
            </p>
            <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700">
              <a href="/events">Upcoming Events</a>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/images/gallery/event2.jpeg"
                  alt="Pretty Girls Love Coded"
                  width={300}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/images/gallery/event3.jpeg"
                  alt="Pretty Girls Love Coded"
                  width={300}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/images/gallery/event7.jpeg"
                  alt="Pretty Girls Love Coded"
                  width={300}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/images/gallery/event4.jpeg"
                  alt="Pretty Girls Love Coded"
                  width={300}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
