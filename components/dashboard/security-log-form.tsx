"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { SecurityLog } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSecurityLog, updateSecurityLog } from "@/app/actions/security-actions"
import { useToast } from "@/components/ui/use-toast"

// Schema for form validation
const formSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().default("pending"),
  assigned_to: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface SecurityLogFormProps {
  securityLog?: SecurityLog
  staff: { id: string; name: string }[]
}

export function SecurityLogForm({ securityLog, staff }: SecurityLogFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize form with existing data or defaults
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: securityLog?.id,
      type: securityLog?.type || "",
      location: securityLog?.location || "",
      description: securityLog?.description || "",
      status: securityLog?.status || "pending",
      assigned_to: securityLog?.assigned_to || "none",
    },
  })

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()

      // Add all form values to FormData
      if (securityLog?.id) {
        formData.append("id", securityLog.id)
        formData.append("current_status", securityLog.status)
      }

      formData.append("type", values.type)
      formData.append("location", values.location)
      formData.append("description", values.description)
      formData.append("status", values.status)
      formData.append("assigned_to", values.assigned_to || "none")

      // Submit form data
      const result = securityLog?.id ? await updateSecurityLog(formData) : await createSecurityLog(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push("/dashboard/security")
        router.refresh()
      } else {
        setError(result.error || "An error occurred")
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
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
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incident Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Access Denied">Access Denied</SelectItem>
                  <SelectItem value="Altercation">Altercation</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Suspicious Activity">Suspicious Activity</SelectItem>
                  <SelectItem value="Ejection">Ejection</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter incident description" rows={4} {...field} disabled={isSubmitting} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assigned_to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned To</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {staff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : securityLog ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
