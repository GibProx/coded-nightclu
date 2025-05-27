"use server"
import { dataProvider } from "@/lib/data-provider"
import type { Staff } from "@/types/database"
import { revalidatePath } from "next/cache"
import { createServerActionClient } from "@/lib/supabase/server"

// Get all staff members
export async function getStaffMembers(): Promise<Staff[]> {
  try {
    return await dataProvider.staff.getAll()
  } catch (error) {
    console.error("Error fetching staff:", error)
    return [] // Return empty array instead of throwing
  }
}

// Get a single staff member by ID
export async function getStaffMember(id: string): Promise<Staff | null> {
  try {
    return await dataProvider.staff.getById(id)
  } catch (error) {
    console.error("Error fetching staff member:", error)
    return null
  }
}

// Create a new staff member with optional user account
export async function createStaffMember(
  staffData: Omit<Staff, "id" | "created_at" | "updated_at"> & {
    create_user_account?: boolean
    temporary_password?: string
    system_access?: boolean
    system_role?: string
    permissions?: any
  },
): Promise<{ success: boolean; data?: Staff; error?: string }> {
  try {
    // Create staff member first
    const result = await dataProvider.staff.create(staffData)

    if (!result.success || !result.data) {
      return result
    }

    // If user account creation is requested, create Supabase user
    if (staffData.create_user_account && staffData.temporary_password) {
      try {
        const supabase = createServerActionClient()

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: staffData.email,
          password: staffData.temporary_password,
          email_confirm: true,
          user_metadata: {
            name: staffData.name,
            role: staffData.system_role || "staff",
            staff_id: result.data.id,
          },
        })

        if (authError) {
          console.error("Error creating user account:", authError)
          // Don't fail the staff creation, just log the error
        } else if (authData.user) {
          // Create profile record
          const { error: profileError } = await supabase.from("profiles").insert({
            id: authData.user.id,
            email: staffData.email,
            name: staffData.name,
            role: staffData.system_role || "staff",
            staff_id: result.data.id,
            permissions: staffData.permissions,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (profileError) {
            console.error("Error creating profile:", profileError)
          }

          // Update staff record with user_id
          await dataProvider.staff.update(result.data.id, {
            user_id: authData.user.id,
            system_access: staffData.system_access,
            system_role: staffData.system_role,
            permissions: staffData.permissions,
          })
        }
      } catch (userError) {
        console.error("Error in user creation process:", userError)
        // Continue with staff creation even if user creation fails
      }
    }

    revalidatePath("/dashboard/staff")
    return result
  } catch (error: any) {
    console.error("Error creating staff member:", error)
    return { success: false, error: error.message || "Failed to create staff member" }
  }
}

// Update a staff member
export async function updateStaffMember(
  id: string,
  staffData: Partial<Staff> & {
    system_access?: boolean
    system_role?: string
    permissions?: any
  },
): Promise<{ success: boolean; data?: Staff; error?: string }> {
  try {
    const result = await dataProvider.staff.update(id, staffData)

    // If updating system access or permissions, update the profile too
    if (staffData.system_access !== undefined || staffData.permissions) {
      try {
        const supabase = createServerActionClient()
        const staff = await dataProvider.staff.getById(id)

        if (staff?.user_id) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              role: staffData.system_role,
              permissions: staffData.permissions,
              updated_at: new Date().toISOString(),
            })
            .eq("id", staff.user_id)

          if (profileError) {
            console.error("Error updating profile:", profileError)
          }
        }
      } catch (profileUpdateError) {
        console.error("Error updating user profile:", profileUpdateError)
      }
    }

    revalidatePath("/dashboard/staff")
    return result
  } catch (error: any) {
    console.error("Error updating staff member:", error)
    return { success: false, error: error.message || "Failed to update staff member" }
  }
}

// Delete a staff member and associated user account
export async function deleteStaffMember(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get staff member to find associated user
    const staff = await dataProvider.staff.getById(id)

    if (staff?.user_id) {
      try {
        const supabase = createServerActionClient()

        // Delete user account
        const { error: deleteUserError } = await supabase.auth.admin.deleteUser(staff.user_id)

        if (deleteUserError) {
          console.error("Error deleting user account:", deleteUserError)
        }

        // Delete profile
        const { error: deleteProfileError } = await supabase.from("profiles").delete().eq("id", staff.user_id)

        if (deleteProfileError) {
          console.error("Error deleting profile:", deleteProfileError)
        }
      } catch (userDeleteError) {
        console.error("Error deleting user data:", userDeleteError)
      }
    }

    const result = await dataProvider.staff.delete(id)
    revalidatePath("/dashboard/staff")
    return result
  } catch (error: any) {
    console.error("Error deleting staff member:", error)
    return { success: false, error: error.message || "Failed to delete staff member" }
  }
}

// Get staff members with system access
export async function getSystemUsers(): Promise<Staff[]> {
  try {
    const allStaff = await dataProvider.staff.getAll()
    return allStaff.filter((staff) => staff.system_access)
  } catch (error) {
    console.error("Error fetching system users:", error)
    return []
  }
}

// Reset user password
export async function resetStaffPassword(
  staffId: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const staff = await dataProvider.staff.getById(staffId)

    if (!staff?.user_id) {
      return { success: false, error: "Staff member does not have a user account" }
    }

    const supabase = createServerActionClient()

    const { error } = await supabase.auth.admin.updateUserById(staff.user_id, {
      password: newPassword,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error resetting password:", error)
    return { success: false, error: error.message || "Failed to reset password" }
  }
}
