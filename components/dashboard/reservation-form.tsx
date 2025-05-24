"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { createReservation, updateReservation } from "@/app/actions/reservation-actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Form schema
const formSchema = z.object({
  id: z.string().optional(),
  guest_id: z.string().optional().nullable(),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  party_size: z.coerce.number().min(1, "Party size must be at least 1"),
  table_number: z.string().optional().nullable(),
  type: z.string({
    required_error: "Please select a reservation type",
  }),
  status: z.string({
    required_error: "Please select a status",
  }),
  special_requests: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>

interface ReservationFormProps {
  reservation?: any
  guests: { id: string; name: string; email?: string | null; phone?: string | null }[]
}

export function ReservationForm({ reservation, guests }: ReservationFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Parse date from string if it exists
  const parseDate = (dateString?: string | null) => {
    if (!dateString) return new Date()
    try {
      return parse(dateString, "yyyy-MM-dd", new Date())
    } catch (e) {
      console.error("Error parsing date:", e)
      return new Date()
    }
  }

  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    id: reservation?.id,
    guest_id: reservation?.guest_id || null,
    date: reservation?.date ? parseDate(reservation.date) : new Date(),
    time: reservation?.time || "19:00",
    party_size: reservation?.party_size || 2,
    table_number: reservation?.table_number || "",
    type: reservation?.type || "Regular",
    status: reservation?.status || "pending",
    special_requests: reservation?.special_requests || "",
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setError(null)

    // Convert date to string format
    const formData = new FormData()

    if (data.id) {
      formData.append("id", data.id)
    }

    if (data.guest_id && data.guest_id !== "none") {
      formData.append("guest_id", data.guest_id)
    }

    formData.append("date", format(data.date, "yyyy-MM-dd"))
    formData.append("time", data.time)
    formData.append("party_size", data.party_size.toString())

    if (data.table_number) {
      formData.append("table_number", data.table_number)
    }

    formData.append("type", data.type)
    formData.append("status", data.status)

    if (data.special_requests) {
      formData.append("special_requests", data.special_requests)
    }

    try {
      const result = reservation ? await updateReservation(formData) : await createReservation(formData)

      if (result.success) {
        toast({
          title: reservation ? "Reservation updated" : "Reservation created",
          description: result.message,
        })

        // Always redirect to the reservations list page after successful submission
        router.push("/dashboard/reservations")
        router.refresh()
      } else {
        setError(result.message || "An error occurred. Please try again.")
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An unexpected error occurred. Please try again.")
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Prevent calendar clicks from submitting the form
  const handleCalendarClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Hidden ID field for updates */}
        {reservation?.id && <input type="hidden" name="id" value={reservation.id} />}

        {/* Guest Selection */}
        <FormField
          control={form.control}
          name="guest_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guest</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a guest (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Walk-in / No guest</SelectItem>
                  {guests.map((guest) => (
                    <SelectItem key={guest.id} value={guest.id}>
                      {guest.name} {guest.phone ? `(${guest.phone})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select a guest or leave empty for walk-ins</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Selection */}
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
                      type="button" // Explicitly set button type to prevent form submission
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      onClick={(e) => e.preventDefault()} // Prevent any form submission
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" onClick={handleCalendarClick}>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) field.onChange(date)
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    onDayClick={(day, e) => {
                      // Prevent the day click from submitting the form
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Selection */}
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Party Size */}
        <FormField
          control={form.control}
          name="party_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Party Size</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Table Number */}
        <FormField
          control={form.control}
          name="table_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Table Number (Optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Leave empty if table will be assigned later</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reservation Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reservation Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Special Requests */}
        <FormField
          control={form.control}
          name="special_requests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requests (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requests or notes"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/reservations")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : reservation ? "Update Reservation" : "Create Reservation"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
