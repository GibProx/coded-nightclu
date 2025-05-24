"use client"

import { createGuest, updateGuest } from "@/app/actions/guest-actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Guest } from "@/types/database"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }).optional().nullable(),
  phone: z.string().optional().nullable(),
  status: z.string().default("Regular"),
  visits: z.coerce.number().int().default(0),
  last_visit: z.date().optional().nullable(),
  spend_total: z.coerce.number().default(0),
  notes: z.string().optional().nullable(),
})

interface GuestFormProps {
  guest?: Guest
}

export function GuestForm({ guest }: GuestFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!guest
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Default values for the form
  const defaultValues: Partial<z.infer<typeof formSchema>> = {
    id: guest?.id || undefined,
    name: guest?.name || "",
    email: guest?.email || "",
    phone: guest?.phone || "",
    status: guest?.status || "Regular",
    visits: guest?.visits || 0,
    last_visit: guest?.last_visit ? new Date(guest.last_visit) : undefined,
    spend_total: guest?.spend_total || 0,
    notes: guest?.notes || "",
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Convert the form data to FormData
      const formData = new FormData()

      // Add all fields to the FormData
      if (data.id) formData.append("id", data.id)
      formData.append("name", data.name)
      if (data.email) formData.append("email", data.email)
      if (data.phone) formData.append("phone", data.phone)
      formData.append("status", data.status)
      formData.append("visits", data.visits.toString())
      if (data.last_visit) formData.append("last_visit", format(data.last_visit, "yyyy-MM-dd"))
      formData.append("spend_total", data.spend_total.toString())
      if (data.notes) formData.append("notes", data.notes)

      // Submit the form
      if (isEditing) {
        const result = await updateGuest(formData)
        if (!result?.success) {
          setSubmitError(result?.error || "Failed to update guest")
          toast({
            title: "Error",
            description: result?.error || "Failed to update guest",
            variant: "destructive",
          })
          return
        }
        toast({
          title: "Success",
          description: "Guest updated successfully",
        })
        router.push("/dashboard/guests")
      } else {
        const result = await createGuest(formData)
        if (!result?.success) {
          setSubmitError(result?.error || "Failed to create guest")
          toast({
            title: "Error",
            description: result?.error || "Failed to create guest",
            variant: "destructive",
          })
          return
        }
        toast({
          title: "Success",
          description: "Guest created successfully",
        })
        router.push("/dashboard/guests")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError("An unexpected error occurred. Please try again.")
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isEditing && <input type="hidden" name="id" value={guest.id} />}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} value={field.value || ""} />
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
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Blacklisted">Blacklisted</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Visits</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_visit"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Last Visit</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
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
            name="spend_total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Spend ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special preferences or information about this guest"
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError && (
          <div className="rounded-md bg-destructive/15 p-3 text-destructive">
            <p>{submitError}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/guests")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Guest" : "Add Guest"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
