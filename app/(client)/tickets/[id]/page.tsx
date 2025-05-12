"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Clock, MapPin, Music, ArrowLeft, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// This would normally come from a database
const getEventById = (id: string) => {
  const events = [
    {
      id: "e1",
      title: "Friday Night Live",
      date: "Friday, November 17, 2023",
      time: "10:00 PM - 4:00 AM",
      dj: "DJ Maxwell",
      description:
        "Start your weekend right with our signature Friday night event featuring DJ Maxwell spinning the best house and electronic music.",
      image: "/placeholder.svg?height=600&width=1200",
      ticketTypes: [
        {
          id: "t1",
          name: "General Admission",
          price: 15,
          description: "Standard entry to the event",
          available: true,
          maxPerOrder: 10,
        },
        {
          id: "t2",
          name: "VIP Entry",
          price: 30,
          description: "Priority entry, access to VIP areas",
          available: true,
          maxPerOrder: 6,
        },
        {
          id: "t3",
          name: "Group (4+)",
          price: 50,
          description: "Discounted entry for groups of 4 or more",
          available: true,
          maxPerOrder: 3,
        },
      ],
    },
    {
      id: "e2",
      title: "Saturday Night Fever",
      date: "Saturday, November 18, 2023",
      time: "10:00 PM - 4:00 AM",
      dj: "DJ Electra",
      description:
        "The ultimate Saturday night experience with DJ Electra bringing you the hottest tracks and infectious beats all night long.",
      image: "/placeholder.svg?height=600&width=1200",
      ticketTypes: [
        {
          id: "t4",
          name: "General Admission",
          price: 20,
          description: "Standard entry to the event",
          available: true,
          maxPerOrder: 10,
        },
        {
          id: "t5",
          name: "VIP Entry",
          price: 40,
          description: "Priority entry, access to VIP areas",
          available: true,
          maxPerOrder: 6,
        },
        {
          id: "t6",
          name: "Group (4+)",
          price: 70,
          description: "Discounted entry for groups of 4 or more",
          available: true,
          maxPerOrder: 3,
        },
      ],
    },
    // More events would be here
  ]

  return events.find((event) => event.id === id)
}

export default function TicketPurchasePage({ params }: { params: { id: string } }) {
  const event = getEventById(params.id)
  const [selectedTicket, setSelectedTicket] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [step, setStep] = useState(1)

  if (!event) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/tickets">Back to Tickets</Link>
        </Button>
      </div>
    )
  }

  const selectedTicketDetails = event.ticketTypes.find((t) => t.id === selectedTicket)
  const subtotal = selectedTicketDetails ? selectedTicketDetails.price * quantity : 0
  const bookingFee = subtotal * 0.1 // 10% booking fee
  const total = subtotal + bookingFee

  return (
    <div className="container py-12">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/tickets">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-[300px] rounded-lg overflow-hidden mb-6">
            <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" priority />
          </div>

          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-muted-foreground">
              <CalendarDays className="mr-2 h-5 w-5" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-2 h-5 w-5" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Music className="mr-2 h-5 w-5" />
              <span>{event.dj}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-5 w-5" />
              <span>Coded Nightclub, Birmingham</span>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">{event.description}</p>

          {step === 1 && (
            <>
              <h2 className="text-xl font-bold mb-4">Select Ticket Type</h2>
              <RadioGroup value={selectedTicket} onValueChange={setSelectedTicket} className="space-y-4 mb-6">
                {event.ticketTypes.map((ticket) => (
                  <div key={ticket.id} className="flex">
                    <div className="flex items-center space-x-2 w-full">
                      <RadioGroupItem value={ticket.id} id={ticket.id} disabled={!ticket.available} />
                      <Label
                        htmlFor={ticket.id}
                        className={`flex flex-1 justify-between ${!ticket.available ? "text-muted-foreground" : ""}`}
                      >
                        <div>
                          <span className="font-medium">{ticket.name}</span>
                          <p className="text-sm text-muted-foreground">{ticket.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">£{ticket.price.toFixed(2)}</span>
                          {!ticket.available && (
                            <Badge variant="outline" className="ml-2">
                              Sold Out
                            </Badge>
                          )}
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {selectedTicket && (
                <>
                  <div className="mb-6">
                    <Label htmlFor="quantity" className="mb-2 block">
                      Quantity
                    </Label>
                    <div className="flex items-center w-32">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={selectedTicketDetails?.maxPerOrder || 10}
                        value={quantity}
                        onChange={(e) => {
                          const val = Number.parseInt(e.target.value)
                          if (!isNaN(val) && val >= 1 && val <= (selectedTicketDetails?.maxPerOrder || 10)) {
                            setQuantity(val)
                          }
                        }}
                        className="mx-2 text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.min(selectedTicketDetails?.maxPerOrder || 10, quantity + 1))}
                        disabled={quantity >= (selectedTicketDetails?.maxPerOrder || 10)}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum {selectedTicketDetails?.maxPerOrder || 10} tickets per order
                    </p>
                  </div>

                  <Button onClick={() => setStep(2)} disabled={!selectedTicket}>
                    Continue to Checkout
                  </Button>
                </>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold mb-4">Checkout</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Enter your last name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="Enter your phone number" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Payment Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name-on-card">Name on Card</Label>
                      <Input id="name-on-card" placeholder="Enter name as it appears on card" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Complete Purchase
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your ticket selection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.date}</p>
                <p className="text-sm text-muted-foreground">{event.time}</p>
              </div>

              {selectedTicket ? (
                <>
                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{selectedTicketDetails?.name}</span>
                      <span>
                        £{selectedTicketDetails?.price.toFixed(2)} x {quantity}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Booking Fee</span>
                      <span>£{bookingFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  <p>Select a ticket type to see your order summary</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <p>All tickets are subject to availability.</p>
              <p>Tickets are non-refundable except in the event of cancellation.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
