"use server"
import { dataProvider } from "@/lib/data-provider"
import type { Staff } from "@/types/database"
import { revalidatePath } from "next/cache"

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

// Create a new staff member
export async function createStaffMember(
  staffData: Omit<Staff, "id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; data?: Staff; error?: string }> {
  try {
    const result = await dataProvider.staff.create(staffData)
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
  staffData: Partial<Staff>,
): Promise<{ success: boolean; data?: Staff; error?: string }> {
  try {
    const result = await dataProvider.staff.update(id, staffData)
    revalidatePath("/dashboard/staff")
    return result
  } catch (error: any) {
    console.error("Error updating staff member:", error)
    return { success: false, error: error.message || "Failed to update staff member" }
  }
}

// Delete a staff member
export async function deleteStaffMember(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await dataProvider.staff.delete(id)
    revalidatePath("/dashboard/staff")
    return result
  } catch (error: any) {
    console.error("Error deleting staff member:", error)
    return { success: false, error: error.message || "Failed to delete staff member" }
  }
}
