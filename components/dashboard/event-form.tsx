"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, Music, MapPin, AlertCircle, InfoIcon, ExternalLink } from "lucide-react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

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
  // Fatsoma integration fields
  external_ticketing: z.boolean().default(true),
  ticketing_provider: z.string().default("fatsoma"),
  fatsoma_event_id: z.string().optional(),
  fatsoma_url: z.string().url("Please enter a valid Fatsoma URL").optional().or(z.literal("")),
})

interface EventFormProps {
  event?: EventFormData & {
    gallery_images?: string[]
    external_ticketing?: boolean
    ticketing_provider?: string
    fatsoma_event_id?: string
    fatsoma_url?: string
  }
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [needsSetup, setNeedsSetup] = useState(false)

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
      external_ticketing: event?.external_ticketing ?? true,
      ticketing_provider: event?.ticketing_provider || "fatsoma",
      fatsoma_event_id: event?.fatsoma_event_id || "",
      fatsoma_url: event?.fatsoma_url || "",
    },
  })

  const watchExternalTicketing = form.watch("external_ticketing")
  const watchFatsomaUrl = form.watch("fatsoma_url")

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

    // Fatsoma integration fields
    formData.append("external_ticketing", String(values.external_ticketing))
    formData.append("ticketing_provider", values.ticketing_provider)
    if (values.fatsoma_event_id) formData.append("fatsoma_event_id", values.fatsoma_event_id)
    if (values.fatsoma_url) formData.append("fatsoma_url", values.fatsoma_url)

    // Ensure gallery_images is a string
    const galleryImagesString = JSON.stringify(values.gallery_images || [])
    formData.append("gallery_images", galleryImagesString)

    try {
      const result = event?.id ? await updateEvent(formData) : await createEvent(formData)

      if (!result.success) {
        // Check if the error is related to missing columns
        if (result.needsSetup) {
          setNeedsSetup(true)
          setError("Database schema needs to be updated. Please run the Fatsoma integration setup first.")
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

        {needsSetup && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Database Setup Required</AlertTitle>
            <AlertDescription className="text-yellow-700">
              The Fatsoma integration fields need to be added to your database before you can use external ticketing
              features.
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/dashboard/ticketing/setup")}
                  className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                >
                  Go to Setup Page
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {event?.id && <input type="hidden" name="id" value={event.id} />}

        <Tabs defaultValue="basic" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="ticketing">Ticketing</TabsTrigger>
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
              <Button type="button" onClick={() => setActiveTab("ticketing")}>
                Next: Ticketing
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ticketing" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Fatsoma Integration
                </CardTitle>
                <CardDescription>
                  Connect your event to Fatsoma for professional ticket sales and management.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="external_ticketing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Use External Ticketing</FormLabel>
                        <FormDescription>
                          Enable this to redirect customers to Fatsoma for ticket purchases instead of handling tickets
                          internally.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchExternalTicketing && (
                  <>
                    <FormField
                      control={form.control}
                      name="ticketing_provider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ticketing Provider</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select ticketing provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fatsoma">Fatsoma</SelectItem>
                              <SelectItem value="eventbrite">Eventbrite</SelectItem>
                              <SelectItem value="ticketmaster">Ticketmaster</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fatsoma_event_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fatsoma Event ID</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 12345" {...field} />
                          </FormControl>
                          <FormDescription>
                            The unique event ID from Fatsoma (optional, for tracking purposes)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fatsoma_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fatsoma Event URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.fatsoma.com/events/your-event" {...field} />
                          </FormControl>
                          <FormDescription>
                            The full URL to your event on Fatsoma where customers will be redirected to buy tickets
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchFatsomaUrl && (
                      <Alert className="bg-green-50 border-green-200">
                        <ExternalLink className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Fatsoma Integration Active</AlertTitle>
                        <AlertDescription className="text-green-700">
                          Customers will be redirected to Fatsoma when they click "Get Tickets" or "Buy Tickets" on your
                          event pages.
                          <br />
                          <a
                            href={watchFatsomaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-green-800 hover:text-green-900 underline"
                          >
                            Preview Fatsoma Event <ExternalLink className="h-3 w-3" />
                          </a>
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}

                {!watchExternalTicketing && (
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Internal Ticketing</AlertTitle>
                    <AlertDescription>
                      With external ticketing disabled, you'll need to set up internal ticket categories and handle
                      payments through your own system.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

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

        {activeTab !== "ticketing" && (
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
