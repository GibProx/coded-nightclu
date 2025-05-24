"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, CheckCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { useState } from "react"
import Image from "next/image"
import { VipExperience } from "@/components/client/vip-experience"

export default function ReservationsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery/event7.jpeg"
            alt="VIP Table Reservations"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Table Reservations</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Reserve your table for an exclusive VIP experience at Coded Nightclub
          </p>
        </div>
      </section>

      {/* Reservation Form Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Reserve Your Table</h2>
              <p className="text-muted-foreground mb-8">
                Elevate your night out with our premium table service. Enjoy dedicated service, premium bottles, and the
                best views of the dance floor.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Premium Experience</h3>
                    <p className="text-muted-foreground">
                      Enjoy dedicated VIP service throughout your night with priority entry and exit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Bottle Service</h3>
                    <p className="text-muted-foreground">
                      Choose from our extensive selection of premium spirits, champagnes, and mixers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Prime Location</h3>
                    <p className="text-muted-foreground">
                      Secure the best tables with optimal views of the DJ and dance floor.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Table Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Standard Table</CardTitle>
                      <CardDescription>For groups of 4-6 people</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold mb-2">
                        $500<span className="text-sm font-normal text-muted-foreground"> min. spend</span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">Includes 1 premium bottle</p>
                      <ul className="text-sm space-y-1 mb-4">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          <span>Dedicated server</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          <span>Priority entry</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          <span>Main floor location</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>VIP Table</CardTitle>
                      <CardDescription>For groups of 6-10 people</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold mb-2">
                        $1,000<span className="text-sm font-normal text-muted-foreground"> min. spend</span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">Includes 2 premium bottles</p>
                      <ul className="text-sm space-y-1 mb-4">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          <span>Dedicated VIP host</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          <span>Express entry</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          <span>Premium elevated location</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Reservation Request</CardTitle>
                  <CardDescription>
                    Fill out the form below to request a table reservation. Our team will contact you to confirm
                    availability and details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReservationForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Experience Gallery */}
      <VipExperience />
    </>
  )
}

function ReservationForm() {
  const [date, setDate] = useState<Date>()

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Enter your full name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" placeholder="Enter your phone number" />
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Select>
            <SelectTrigger id="time">
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9pm">9:00 PM</SelectItem>
              <SelectItem value="10pm">10:00 PM</SelectItem>
              <SelectItem value="11pm">11:00 PM</SelectItem>
              <SelectItem value="12am">12:00 AM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests">Number of Guests</Label>
          <Select>
            <SelectTrigger id="guests">
              <SelectValue placeholder="Select number of guests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 guests</SelectItem>
              <SelectItem value="5">5 guests</SelectItem>
              <SelectItem value="6">6 guests</SelectItem>
              <SelectItem value="7">7 guests</SelectItem>
              <SelectItem value="8">8 guests</SelectItem>
              <SelectItem value="9">9 guests</SelectItem>
              <SelectItem value="10">10 guests</SelectItem>
              <SelectItem value="10+">More than 10 guests</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="table-type">Table Type</Label>
          <Select>
            <SelectTrigger id="table-type">
              <SelectValue placeholder="Select table type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Table ($500 min)</SelectItem>
              <SelectItem value="vip">VIP Table ($1,000 min)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="special-requests">Special Requests</Label>
          <Textarea id="special-requests" placeholder="Any special requests or occasions?" className="min-h-[100px]" />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Submit Reservation Request
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting this form, you agree to our terms and conditions. A reservation is not confirmed until you receive
        confirmation from our team.
      </p>
    </form>
  )
}
