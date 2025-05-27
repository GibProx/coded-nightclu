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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  // User management fields
  system_access: z.boolean().default(false),
  system_role: z.enum(["admin", "manager", "staff", "viewer"]).optional(),
  create_user_account: z.boolean().default(false),
  temporary_password: z.string().optional(),
  permissions: z
    .object({
      can_view_dashboard: z.boolean().default(false),
      can_manage_guests: z.boolean().default(false),
      can_manage_reservations: z.boolean().default(false),
      can_manage_events: z.boolean().default(false),
      can_manage_inventory: z.boolean().default(false),
      can_manage_staff: z.boolean().default(false),
      can_view_analytics: z.boolean().default(false),
      can_manage_security: z.boolean().default(false),
    })
    .optional(),
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
      system_access: initialData?.system_access ?? false,
      system_role: (initialData?.system_role as any) || "staff",
      create_user_account: false,
      temporary_password: "",
      permissions: {
        can_view_dashboard: initialData?.permissions?.can_view_dashboard ?? false,
        can_manage_guests: initialData?.permissions?.can_manage_guests ?? false,
        can_manage_reservations: initialData?.permissions?.can_manage_reservations ?? false,
        can_manage_events: initialData?.permissions?.can_manage_events ?? false,
        can_manage_inventory: initialData?.permissions?.can_manage_inventory ?? false,
        can_manage_staff: initialData?.permissions?.can_manage_staff ?? false,
        can_view_analytics: initialData?.permissions?.can_view_analytics ?? false,
        can_manage_security: initialData?.permissions?.can_manage_security ?? false,
      },
    },
  })

  const watchSystemAccess = form.watch("system_access")
  const watchSystemRole = form.watch("system_role")

  // Auto-set permissions based on system role
  const handleSystemRoleChange = (role: string) => {
    const permissions = form.getValues("permissions") || {}

    switch (role) {
      case "admin":
        form.setValue("permissions", {
          can_view_dashboard: true,
          can_manage_guests: true,
          can_manage_reservations: true,
          can_manage_events: true,
          can_manage_inventory: true,
          can_manage_staff: true,
          can_view_analytics: true,
          can_manage_security: true,
        })
        break
      case "manager":
        form.setValue("permissions", {
          can_view_dashboard: true,
          can_manage_guests: true,
          can_manage_reservations: true,
          can_manage_events: true,
          can_manage_inventory: true,
          can_manage_staff: false,
          can_view_analytics: true,
          can_manage_security: true,
        })
        break
      case "staff":
        form.setValue("permissions", {
          can_view_dashboard: true,
          can_manage_guests: true,
          can_manage_reservations: true,
          can_manage_events: false,
          can_manage_inventory: false,
          can_manage_staff: false,
          can_view_analytics: false,
          can_manage_security: false,
        })
        break
      case "viewer":
        form.setValue("permissions", {
          can_view_dashboard: true,
          can_manage_guests: false,
          can_manage_reservations: false,
          can_manage_events: false,
          can_manage_inventory: false,
          can_manage_staff: false,
          can_view_analytics: true,
          can_manage_security: false,
        })
        break
    }
  }

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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Basic staff member details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
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
                    <FormLabel>Job Role</FormLabel>
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
                      <FormDescription>Whether this staff member is currently active and working.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* System Access */}
          <Card>
            <CardHeader>
              <CardTitle>System Access</CardTitle>
              <CardDescription>Configure system access and user account settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="system_access"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">System Access</FormLabel>
                      <FormDescription>Allow this staff member to access the management system.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchSystemAccess && (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="system_role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>System Role</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              handleSystemRoleChange(value)
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select system role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin - Full access</SelectItem>
                              <SelectItem value="manager">Manager - Most features</SelectItem>
                              <SelectItem value="staff">Staff - Basic operations</SelectItem>
                              <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!initialData && (
                      <FormField
                        control={form.control}
                        name="create_user_account"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Create User Account</FormLabel>
                              <FormDescription>Create a login account for this staff member.</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {form.watch("create_user_account") && !initialData && (
                    <FormField
                      control={form.control}
                      name="temporary_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temporary Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter temporary password"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Staff member will be required to change this password on first login.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Permissions */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium">Permissions</h4>
                      <p className="text-sm text-muted-foreground">
                        Configure what this staff member can access in the system.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="permissions.can_view_dashboard"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">View Dashboard</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permissions.can_manage_guests"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Manage Guests</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permissions.can_manage_reservations"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Manage Reservations</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permissions.can_manage_events"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Manage Events</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permissions.can_manage_inventory"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Manage Inventory</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permissions.can_manage_staff"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Manage Staff</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permissions.can_view_analytics"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">View Analytics</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permissions.can_manage_security"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Manage Security</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

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
    </div>
  )
}
