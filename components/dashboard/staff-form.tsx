"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { createStaffMember, updateStaffMember } from "@/app/actions/staff-actions"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Staff } from "@/types/database"

const staffFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  role: z.string().min(1, {
    message: "Please select a role.",
  }),
  shift_pattern: z.string().optional(),
  active: z.boolean().default(true),
  avatar_url: z.string().optional(),
})

type StaffFormValues = z.infer<typeof staffFormSchema>

interface StaffFormProps {
  initialData?: Staff | null
}

export function StaffForm({ initialData }: StaffFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      role: initialData?.role || "",
      shift_pattern: initialData?.shift_pattern || "",
      active: initialData?.active ?? true,
      avatar_url: initialData?.avatar_url || "",
    },
  })

  async function onSubmit(data: StaffFormValues) {
    setIsSubmitting(true)
    try {
      if (initialData) {
        // Update existing staff member
        const result = await updateStaffMember(initialData.id, data)
        if (result.success) {
          toast({
            title: "Staff member updated",
            description: "The staff member has been updated successfully.",
          })
          router.push("/dashboard/staff")
          router.refresh()
        } else {
          throw new Error(result.error || "Failed to update staff member")
        }
      } else {
        // Create new staff member
        const result = await createStaffMember(data)
        if (result.success) {
          toast({
            title: "Staff member created",
            description: "The staff member has been created successfully.",
          })
          router.push("/dashboard/staff")
          router.refresh()
        } else {
          throw new Error(result.error || "Failed to create staff member")
        }
      }
    } catch (error) {
      console.error("Error submitting staff form:", error)
      toast({
        title: "Error",
        description: "There was an error saving the staff member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
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
                  <Input type="email" placeholder="john@example.com" {...field} />
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
                  <Input placeholder="555-123-4567" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Bartender">Bartender</SelectItem>
                    <SelectItem value="Server">Server</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="DJ">DJ</SelectItem>
                    <SelectItem value="Host">Host</SelectItem>
                    <SelectItem value="Cleaner">Cleaner</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shift_pattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift Pattern</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a shift pattern" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Weekends">Weekends</SelectItem>
                    <SelectItem value="Weekdays">Weekdays</SelectItem>
                    <SelectItem value="Evenings">Evenings</SelectItem>
                    <SelectItem value="Friday/Saturday">Friday/Saturday</SelectItem>
                    <SelectItem value="Thursday-Sunday">Thursday-Sunday</SelectItem>
                    <SelectItem value="Monday-Wednesday">Monday-Wednesday</SelectItem>
                    <SelectItem value="Flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/avatar.jpg" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>URL to the staff member's profile picture.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>
                    Whether this staff member is currently active and working at the venue.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/staff")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Staff Member" : "Create Staff Member"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
