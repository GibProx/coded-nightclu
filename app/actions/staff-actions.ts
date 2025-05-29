"use server"
import { dataProvider } from "@/lib/data-provider"
import type { Staff } from "@/types/database"
import { revalidatePath } from "next/cache"
import { createServerActionClient } from "@/lib/supabase/server"

// Check if user management columns exist
async function checkUserManagementColumns(): Promise<boolean> {
  try {
    const supabase = createServerActionClient()
    const { data, error } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", "staff")
      .in("column_name", ["user_id", "system_access", "system_role", "permissions"])

    if (error) {
      console.error("Error checking columns:", error)
      return false
    }

    return data && data.length >= 4
  } catch (error) {
    console.error("Error in column check:", error)
    return false
  }
}

// Get all staff members
export async function getStaffMembers(): Promise<Staff[]> {
  try {
    return await dataProvider.staff.getAll()
  } catch (error) {
    console.error("Error fetching staff:", error)
    return []
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
export async function createStaffMember(formData: any): Promise<{ success: boolean; data?: Staff; error?: string }> {
  try {
    // Check if user management columns exist
    const hasUserManagementColumns = await checkUserManagementColumns()

    // Extract form-only fields and user management fields
    const { create_user_account, temporary_password, system_access, system_role, permissions, ...basicStaffData } =
      formData

    // Prepare data for database - only include fields that exist
    let staffDataForDB = { ...basicStaffData }

    if (hasUserManagementColumns) {
      // Include user management fields if columns exist
      staffDataForDB = {
        ...staffDataForDB,
        system_access: system_access ?? false,
        system_role: system_role ?? "staff",
        permissions: permissions ?? {},
      }
    } else {
      console.log("User management columns not found, creating basic staff record only")
    }

    // Create staff member
    const result = await dataProvider.staff.create(staffDataForDB)

    if (!result.success || !result.data) {
      return result
    }

    // If user account creation is requested and we have the columns, create Supabase user
    if (hasUserManagementColumns && create_user_account && temporary_password) {
      try {
        const supabase = createServerActionClient()

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: basicStaffData.email,
          password: temporary_password,
          email_confirm: true,
          user_metadata: {
            name: basicStaffData.name,
            role: system_role || "staff",
            staff_id: result.data.id,
          },
        })

        if (authError) {
          console.error("Error creating user account:", authError)
        } else if (authData.user) {
          // Create profile record if profiles table exists
          try {
            const { error: profileError } = await supabase.from("profiles").insert({
              id: authData.user.id,
              email: basicStaffData.email,
              name: basicStaffData.name,
              role: system_role || "staff",
              staff_id: result.data.id,
              permissions: permissions || {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

            if (profileError) {
              console.error("Error creating profile:", profileError)
            }
          } catch (profileCreateError) {
            console.error("Profiles table may not exist:", profileCreateError)
          }

          // Update staff record with user_id
          try {
            await dataProvider.staff.update(result.data.id, {
              user_id: authData.user.id,
            })
          } catch (updateError) {
            console.error("Error updating staff with user_id:", updateError)
          }
        }
      } catch (userError) {
        console.error("Error in user creation process:", userError)
      }
    }

    revalidatePath("/dashboard/staff")
    return result
  } catch (error: any) {
    console.error("Error creating staff member:", error)

    // Provide helpful error message
    if (error.message?.includes("permissions") || error.message?.includes("system_access")) {
      return {
        success: false,
        error: "User management features require database setup. Please run the database migration first.",
      }
    }

    return { success: false, error: error.message || "Failed to create staff member" }
  }
}

// Update a staff member
export async function updateStaffMember(
  id: string,
  formData: any,
): Promise<{ success: boolean; data?: Staff; error?: string }> {
  try {
    // Check if user management columns exist
    const hasUserManagementColumns = await checkUserManagementColumns()

    // Extract form-only fields and user management fields
    const { create_user_account, temporary_password, system_access, system_role, permissions, ...basicStaffData } =
      formData

    // Prepare data for database - only include fields that exist
    const staffDataForDB = { ...basicStaffData }

    if (hasUserManagementColumns) {
      // Include user management fields if columns exist
      if (system_access !== undefined) staffDataForDB.system_access = system_access
      if (system_role !== undefined) staffDataForDB.system_role = system_role
      if (permissions !== undefined) staffDataForDB.permissions = permissions
    }

    const result = await dataProvider.staff.update(id, staffDataForDB)

    // If updating system access or permissions and columns exist, update the profile too
    if (hasUserManagementColumns && (system_access !== undefined || permissions)) {
      try {
        const supabase = createServerActionClient()
        const staff = await dataProvider.staff.getById(id)

        if (staff?.user_id) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              role: system_role,
              permissions: permissions,
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

    // Provide helpful error message
    if (error.message?.includes("permissions") || error.message?.includes("system_access")) {
      return {
        success: false,
        error: "User management features require database setup. Please run the database migration first.",
      }
    }

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

// Check if user management is available
export async function checkUserManagementAvailable(): Promise<boolean> {
  return await checkUserManagementColumns()
}
