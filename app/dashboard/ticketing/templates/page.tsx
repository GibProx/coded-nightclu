import { Suspense } from "react"
import { TicketTemplateManager } from "@/components/dashboard/ticket-template-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TicketTemplatesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ticket Templates</h1>
        <Button asChild>
          <Link href="/dashboard/ticketing">Back to Ticketing</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Ticket Templates</CardTitle>
            <CardDescription>
              Create and manage ticket templates to use when creating events. Templates help you quickly set up ticket
              categories and pricing for different types of events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading ticket templates...</div>}>
              <TicketTemplateManager />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
