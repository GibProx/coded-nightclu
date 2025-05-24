import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactSection() {
  return (
    <div className="container">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-muted-foreground mb-8">
          Have questions or want to book a table? Get in touch with us and we'll get back to you as soon as possible.
        </p>
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input placeholder="Name" />
            </div>
            <div>
              <Input type="email" placeholder="Email" />
            </div>
          </div>
          <div>
            <Input placeholder="Subject" />
          </div>
          <div>
            <Textarea placeholder="Message" rows={5} />
          </div>
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  )
}
