"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, AlertCircle } from "lucide-react"

interface TicketType {
  name: string
  price: number
  available: boolean
}

interface TicketCategory {
  name: string
  description?: string
  tickets: TicketType[]
}

interface EventTicketDisplayProps {
  ticketCategories: TicketCategory[]
  eventName: string
}

export function EventTicketDisplay({ ticketCategories, eventName }: EventTicketDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    ticketCategories.length > 0 ? ticketCategories[0].name : "",
  )

  // Check if we have any available tickets
  const hasAvailableTickets = ticketCategories.some((category) => category.tickets.some((ticket) => ticket.available))

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tickets</h2>

      {!hasAvailableTickets && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <p className="text-amber-800">
            All tickets for this event are currently sold out. Please check back later or contact us for more
            information.
          </p>
        </div>
      )}

      {ticketCategories.length > 0 ? (
        <>
          <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full h-auto">
              {ticketCategories.map((category) => (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {ticketCategories.map((category) => (
              <TabsContent key={category.name} value={category.name} className="pt-4">
                {category.description && <p className="text-muted-foreground mb-4">{category.description}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.tickets.map((ticket, index) => (
                    <Card key={index} className={ticket.available ? "" : "opacity-75"}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{ticket.name}</CardTitle>
                          {ticket.available ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Sold Out
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold mb-2">£{ticket.price.toFixed(2)}</div>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                            Entry to {eventName}
                          </li>
                          {ticket.name.toLowerCase().includes("vip") && (
                            <>
                              <li className="flex items-center">
                                <Check className="h-4 w-4 mr-2 text-green-600" />
                                Priority entry
                              </li>
                              <li className="flex items-center">
                                <Check className="h-4 w-4 mr-2 text-green-600" />
                                Access to VIP area
                              </li>
                            </>
                          )}
                          {ticket.name.toLowerCase().includes("table") && (
                            <>
                              <li className="flex items-center">
                                <Check className="h-4 w-4 mr-2 text-green-600" />
                                Reserved table
                              </li>
                              <li className="flex items-center">
                                <Check className="h-4 w-4 mr-2 text-green-600" />
                                Bottle service available
                              </li>
                            </>
                          )}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" disabled={!ticket.available}>
                          {ticket.available ? "Buy Now" : "Sold Out"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No ticket information available for this event yet.</p>
        </div>
      )}
    </div>
  )
}
