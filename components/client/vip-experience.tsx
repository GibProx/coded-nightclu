import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function VipExperience() {
  return (
    <section className="py-16 bg-black/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">VIP Experience</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Glimpses of our exclusive VIP table service and bottle presentations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="overflow-hidden bg-black/40 border-0">
            <CardContent className="p-0 relative aspect-[4/5]">
              <Image src="/images/gallery/event1.jpeg" alt="VIP Service" fill className="object-cover" />
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-black/40 border-0">
            <CardContent className="p-0 relative aspect-[4/5]">
              <Image src="/images/gallery/event7.jpeg" alt="Bottle Service" fill className="object-cover" />
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-black/40 border-0">
            <CardContent className="p-0 relative aspect-[4/5]">
              <Image src="/images/gallery/event4.jpeg" alt="VIP Experience" fill className="object-cover" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
