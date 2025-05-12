import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function EventPage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="w-[380px] mx-auto">
        <CardHeader>
          <CardTitle>Coded Nightclub Event</CardTitle>
          <CardDescription>Details about the event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location</Label>
              <span>Coded Nightclub, Birmingham, UK</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Date</Label>
              <p className="text-sm text-muted-foreground">October 27, 2023</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Address</Label>
              <p className="text-sm text-muted-foreground">Coded Nightclub</p>
              <p className="text-sm text-muted-foreground">45 Broad Street, Birmingham, B1 2HP, UK</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Share</Button>
          <Button>Attend</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
