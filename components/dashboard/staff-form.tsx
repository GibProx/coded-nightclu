"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { createStaffMember, updateStaffMember, checkUserManagementAvailable } from "@/app/actions/staff-actions"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, User, Settings, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  // User management fields (optional when not available)
  system_access: z.boolean().default(false).optional(),
  system_role: z.enum(["admin", "manager", "staff", "viewer"]).optional(),
  create_user_account: z.boolean().default(false).optional(),
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
  const [userManagementAvailable, setUserManagementAvailable] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(true)

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

  // Check if user management features are available
  useEffect(() => {
    async function checkAvailability() {
      try {
        const available = await checkUserManagementAvailable()
        setUserManagementAvailable(available)
      } catch (error) {
        console.error("Error checking user management availability:", error)
        setUserManagementAvailable(false)
      } finally {
        setCheckingAvailability(false)
      }
    }
    checkAvailability()
  }, [])

  const watchSystemAccess = form.watch("system_access")

  // Auto-set permissions based on system role
  const handleSystemRoleChange = (role: string) => {
    if (!userManagementAvailable) return

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
        description:
          error instanceof Error ? error.message : "There was an error saving the staff member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (checkingAvailability) {
    return <div>Checking user management availability...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5" />
        <h1 className="text-2xl font-bold">{initialData ? "Edit Staff Member" : "Create New Staff Member"}</h1>
      </div>

      {!userManagementAvailable && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            User management features are not available. Database migration required.
            <Button variant="link" className="p-0 h-auto ml-1" asChild>
              <a href="/dashboard/setup">Run database setup</a>
            </Button>
            to enable user accounts and permissions.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className={`grid w-full ${userManagementAvailable ? "grid-cols-3" : "grid-cols-1"}`}>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              {userManagementAvailable && (
                <>
                  <TabsTrigger value="access" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    System Access
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Permissions
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Profile</CardTitle>
                  <CardDescription>Basic staff member information and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@coded.com" {...field} />
                        </FormControl>
                        <FormDescription>Contact email address</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
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
                            <SelectItem value="Admin">System Admin</SelectItem>
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
                        <FormLabel>Work Schedule</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select schedule" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Weekends">Weekends</SelectItem>
                            <SelectItem value="Weekdays">Weekdays</SelectItem>
                            <SelectItem value="Evenings">Evenings</SelectItem>
                            <SelectItem value="Friday/Saturday">Friday/Saturday</SelectItem>
                            <SelectItem value="Thursday-Sunday">Thursday-Sunday</SelectItem>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
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
                        <FormLabel>Profile Picture URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/avatar.jpg" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>Optional profile picture URL</FormDescription>
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
                          <FormDescription>Whether this staff member is currently active</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Access Tab - Only show if user management is available */}
            {userManagementAvailable && (
              <TabsContent value="access">
                <Card>
                  <CardHeader>
                    <CardTitle>System Access Configuration</CardTitle>
                    <CardDescription>Configure login access and user account settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="system_access"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable System Access</FormLabel>
                            <FormDescription>
                              Allow this staff member to log in to the management system
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {watchSystemAccess && (
                      <>
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
                                  <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="destructive">Admin</Badge>
                                      <span>Full system access</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="manager">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary">Manager</Badge>
                                      <span>Management features</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="staff">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">Staff</Badge>
                                      <span>Basic operations</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="viewer">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">Viewer</Badge>
                                      <span>Read-only access</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Role determines default permissions. You can customize permissions in the next tab.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {!initialData && (
                          <>
                            <FormField
                              control={form.control}
                              name="create_user_account"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Create Login Account</FormLabel>
                                    <FormDescription>Create a login account for this staff member</FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            {form.watch("create_user_account") && (
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
                          </>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Permissions Tab - Only show if user management is available */}
            {userManagementAvailable && (
              <TabsContent value="permissions">
                <Card>
                  <CardHeader>
                    <CardTitle>User Permissions</CardTitle>
                    <CardDescription>
                      Configure what this staff member can access and manage in the system.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {watchSystemAccess ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="permissions.can_view_dashboard"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm font-medium">Dashboard Access</FormLabel>
                                <FormDescription className="text-xs">View main dashboard and metrics</FormDescription>
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
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm font-medium">Guest Management</FormLabel>
                                <FormDescription className="text-xs">
                                  Create, edit, and view guest records
                                </FormDescription>
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
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm font-medium">Reservation Management</FormLabel>
                                <FormDescription className="text-xs">
                                  Handle bookings and table assignments
                                </FormDescription>
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
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm font-medium">Event Management</FormLabel>
                                <FormDescription className="text-xs">Create and manage events</FormDescription>
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
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm font-medium">Inventory Management</FormLabel>
                                <FormDescription className="text-xs">Stock control and ordering</FormDescription>
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
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm font-medium">User Management</FormLabel>
                                <FormDescription className="text-xs">
                                  Manage other users and permissions
                                </FormDescription>
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
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm font-medium">Analytics Access</FormLabel>
                                <FormDescription className="text-xs">View business reports and metrics</FormDescription>
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
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm font-medium">Security Management</FormLabel>
                                <FormDescription className="text-xs">
                                  Handle security logs and incidents
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Enable system access to configure permissions</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

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
