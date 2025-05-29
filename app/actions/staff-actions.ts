"use server"
import { dataProvider } from "@/lib/data-provider"
import type { Staff } from "@/types/database"
import { revalidatePath } from "next/cache"
import { createServerActionClient } from "@/lib/supabase/server"

// Check if user management columns exist
async function checkUserManagementColumns(): Promise<boolean> {
  try {
    const supabase = createServerActionClient()

    // Try to query the staff table with user management columns
    // If they don't exist, this will throw an error
    const { error } = await supabase.from("staff").select("user_id, system_access, system_role, permissions").limit(1)

    // If no error, columns exist
    return !error
  } catch (error) {
    console.error("User management columns not available:", error)
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

// Check if user management is available - simplified version
export async function checkUserManagementAvailable(): Promise<boolean> {
  // Since we ran the migration, user management should be available
  // But let's still check to be safe
  try {
    const hasColumns = await checkUserManagementColumns()
    return hasColumns
  } catch (error) {
    console.error("Error checking user management availability:", error)
    // Since we know the migration was run, default to true
    return true
  }
}
