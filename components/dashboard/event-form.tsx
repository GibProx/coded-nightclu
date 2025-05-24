"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, Music, MapPin, AlertCircle, InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createEvent, updateEvent, type EventFormData } from "@/app/actions/event-actions"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from "@/components/ui/image-upload"
import { MultiImageUpload } from "@/components/ui/multi-image-upload"
import { TicketCategorySelector, type TicketCategory } from "./ticket-category-selector"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const ticketTypeSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  price: z.number().min(0, "Price cannot be negative"),
  available: z.boolean().default(true),
})

const ticketCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  tickets: z.array(ticketTypeSchema),
})

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Event description is required"),
  long_description: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
  }),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  ticket_price: z.number().min(0, "Ticket price cannot be negative"),
  status: z.string().min(1, "Status is required"),
  dj: z.string().optional(),
  main_image: z.string().min(1, "Main image is required"),
  gallery_images: z.array(z.string()).optional(),
})

// Default ticket categories
const defaultTicketCategories = [
  {
    name: "Standard Tickets",
    description: "Regular admission tickets",
    tickets: [
      { name: "General Admission", price: 25, available: true },
      { name: "VIP Entry", price: 50, available: true },
      { name: "Table Reservation", price: 300, available: true },
    ],
  },
]

interface EventFormProps {
  event?: EventFormData & {
    ticket_categories?: any
    gallery_images?: string[]
  }
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [databaseError, setDatabaseError] = useState(false)

  // Parse ticket categories from JSON string if available
  const initialTicketCategories = event?.ticket_categories
    ? typeof event.ticket_categories === "string"
      ? JSON.parse(event.ticket_categories)
      : event.ticket_categories
    : defaultTicketCategories

  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>(initialTicketCategories)
  const [ticketCategoriesChanged, setTicketCategoriesChanged] = useState(false)

  // Parse gallery images from JSON string if available
  const initialGalleryImages = event?.gallery_images
    ? typeof event.gallery_images === "string"
      ? JSON.parse(event.gallery_images)
      : event.gallery_images
    : []

  // Ensure numeric values are properly initialized
  const defaultCapacity = event?.capacity ? Number(event.capacity) : 400
  const defaultTicketPrice = event?.ticket_price ? Number(event.ticket_price) : 25

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: event?.id || undefined,
      name: event?.name || "",
      description: event?.description || "",
      long_description: event?.long_description || "",
      date: event?.date ? new Date(event.date) : new Date(),
      start_time: event?.start_time || "22:00",
      end_time: event?.end_time || "04:00",
      location: event?.location || "Coded Nightclub, 45 Broad Street, Birmingham, B1 2HP",
      capacity: isNaN(defaultCapacity) ? 400 : defaultCapacity,
      ticket_price: isNaN(defaultTicketPrice) ? 25 : defaultTicketPrice,
      status: event?.status || "On Sale",
      dj: event?.dj || "",
      main_image: event?.main_image || "/images/gallery/event1.jpeg",
      gallery_images: initialGalleryImages,
    },
  })

  // Handle ticket category changes
  const handleTicketCategoriesChange = (categories: TicketCategory[]) => {
    setTicketCategories(categories)
    setTicketCategoriesChanged(true)
    // Show a toast to confirm changes
    if (categories.length > 0 && !ticketCategoriesChanged) {
      toast({
        title: "Ticket categories updated",
        description: "Your ticket categories have been updated. Don't forget to save the event to apply changes.",
      })
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()

    if (values.id) {
      formData.append("id", values.id)
    }

    formData.append("name", values.name)
    formData.append("description", values.description)
    if (values.long_description) formData.append("long_description", values.long_description)
    formData.append("date", format(values.date, "yyyy-MM-dd"))
    formData.append("start_time", values.start_time)
    formData.append("end_time", values.end_time)
    formData.append("location", values.location)
    formData.append("capacity", String(values.capacity))
    formData.append("ticket_price", String(values.ticket_price))
    formData.append("status", values.status)
    if (values.dj) formData.append("dj", values.dj)
    formData.append("main_image", values.main_image)

    // Ensure gallery_images is a string
    const galleryImagesString = JSON.stringify(values.gallery_images || [])
    formData.append("gallery_images", galleryImagesString)

    // Ensure ticket_categories is a string
    const ticketCategoriesString = JSON.stringify(ticketCategories || [])
    formData.append("ticket_categories", ticketCategoriesString)

    try {
      const result = event?.id ? await updateEvent(formData) : await createEvent(formData)

      if (!result.success) {
        // Check if the error is related to missing columns
        if (
          result.error &&
          (result.error.includes("column") ||
            result.error.includes("schema") ||
            result.error.includes("ticket_types") ||
            result.error.includes("ticket_categories"))
        ) {
          setDatabaseError(true)
          setError("Database schema needs to be updated. Please run the database setup first.")
        } else {
          setError(result.error || "Failed to save event")
        }

        toast({
          title: "Error",
          description: result.error || "Failed to save event",
          variant: "destructive",
        })
      } else {
        // Show success toast
        toast({
          title: "Success",
          description: result.message || "Event saved successfully",
        })

        // Navigate programmatically after successful save
        router.push("/dashboard/ticketing")
        router.refresh()
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (databaseError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-destructive">Database Update Required</CardTitle>
          <CardDescription>
            The events table needs to be updated to support ticket categories and other new features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Schema Error</AlertTitle>
            <AlertDescription>
              {error || "The database schema needs to be updated to support the new event features."}
            </AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground mb-4">
            Please run the database setup to add the required columns to the events table. This is a one-time setup that
            will enable all the new event features.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard/ticketing")}>
            Cancel
          </Button>
          <Button onClick={() => router.push("/dashboard/ticketing/setup")}>Go to Database Setup</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {event?.id && <input type="hidden" name="id" value={event.id} />}

        <Tabs defaultValue="basic" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Friday Night Live" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="On Sale">On Sale</SelectItem>
                        <SelectItem value="Sold Out">Sold Out</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Start your weekend right with our signature Friday night event..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>A brief description for event listings (max 200 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => field.onChange(date || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <Clock className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <Clock className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        value={String(value)}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : Number(e.target.value)
                          onChange(isNaN(val) ? 0 : val)
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormDescription>Maximum number of attendees</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ticket_price"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Base Ticket Price</FormLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">£</span>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="pl-7"
                          value={String(value)}
                          onChange={(e) => {
                            const val = e.target.value === "" ? 0 : Number(e.target.value)
                            onChange(isNaN(val) ? 0 : val)
                          }}
                          {...fieldProps}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>Starting price for general admission</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/ticketing")}>
                Cancel
              </Button>
              <Button type="button" onClick={() => setActiveTab("details")}>
                Next: Event Details
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="long_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Friday Night Live at Coded is the perfect way to kick off your weekend..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Detailed description with formatting (supports line breaks)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input placeholder="Coded Nightclub, 45 Broad Street..." {...field} />
                      </FormControl>
                      <MapPin className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DJ / Performer</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input placeholder="DJ Maxwell" {...field} />
                      </FormControl>
                      <Music className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" onClick={() => setActiveTab("basic")}>
                Back: Basic Info
              </Button>
              <Button type="button" onClick={() => setActiveTab("media")}>
                Next: Media
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="main_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Event Image</FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>This will be the featured image for your event</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gallery_images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gallery Images</FormLabel>
                  <FormControl>
                    <MultiImageUpload value={field.value || []} onChange={field.onChange} max={8} />
                  </FormControl>
                  <FormDescription>Additional images for the event gallery (max 8)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button type="button" onClick={() => setActiveTab("details")}>
                Back: Event Details
              </Button>
              <Button type="button" onClick={() => setActiveTab("tickets")}>
                Next: Tickets
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6 pt-4">
            <TooltipProvider>
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-medium">Ticket Categories</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                      <InfoIcon className="h-4 w-4" />
                      <span className="sr-only">About ticket categories</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      Ticket categories allow you to group different types of tickets together. For example, you might
                      have "Standard Tickets" and "VIP Tickets" categories, each with different ticket types and prices.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            {ticketCategories.length > 0 && (
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Ticket Categories</AlertTitle>
                <AlertDescription className="text-blue-700">
                  {ticketCategoriesChanged
                    ? "Your ticket categories have been updated. Don't forget to save the event to apply changes."
                    : "You can customize ticket categories below. Changes will be saved when you submit the form."}
                </AlertDescription>
              </Alert>
            )}

            <TicketCategorySelector value={ticketCategories} onChange={handleTicketCategoriesChange} />

            <div className="flex justify-between pt-4">
              <Button type="button" onClick={() => setActiveTab("media")}>
                Back: Media
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : event?.id ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {activeTab !== "tickets" && (
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/ticketing")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : event?.id ? "Update Event" : "Create Event"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
