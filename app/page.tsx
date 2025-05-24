import { HeroSection } from "@/components/client/hero-section"
import { AboutSection } from "@/components/client/about-section"
import { EventsSection } from "@/components/client/events-section"
import { ContactSection } from "@/components/client/contact-section"
import { PromoSection } from "@/components/client/promo-section"
import { FeaturedEvents } from "@/components/client/featured-events"

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="py-16 bg-gradient-to-b from-black to-background">
        <AboutSection />
      </section>

      <PromoSection />

      <section className="py-16 bg-background">
        <EventsSection />
      </section>

      <FeaturedEvents />

      <section className="py-16 bg-primary/10">
        <ContactSection />
      </section>
    </>
  )
}
