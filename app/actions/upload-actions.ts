"use server"

import { createServerActionClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

// Bucket name constant to ensure consistency
const BUCKET_NAME = "event-images"

// Function to ensure bucket exists
async function ensureBucketExists(supabase: any) {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets.some((bucket: any) => bucket.name === BUCKET_NAME)

    // Create bucket if it doesn't exist
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true, // Make bucket public
        fileSizeLimit: 5242880, // 5MB in bytes
      })

      if (error) {
        console.error("Error creating bucket:", error)
        throw error
      }

      console.log(`Bucket ${BUCKET_NAME} created successfully`)
    }

    return true
  } catch (error) {
    console.error("Error ensuring bucket exists:", error)
    throw error
  }
}

export async function uploadImage(formData: FormData) {
  const supabase = createServerActionClient()
  const file = formData.get("file") as File

  if (!file) {
    return { success: false, error: "No file provided" }
  }

  // Check file type
  const fileType = file.type
  if (!fileType.startsWith("image/")) {
    return { success: false, error: "File must be an image" }
  }

  // Check file size (limit to 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { success: false, error: "File size must be less than 5MB" }
  }

  try {
    // Ensure bucket exists before uploading
    await ensureBucketExists(supabase)

    // Generate a unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `events/${fileName}`

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, buffer, {
      contentType: fileType,
      upsert: false,
    })

    if (error) {
      console.error("Error uploading image:", error)
      return { success: false, error: error.message }
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
      message: "Image uploaded successfully",
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { success: false, error: "Failed to upload image" }
  }
}

export async function deleteImage(path: string) {
  const supabase = createServerActionClient()

  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path])

    if (error) {
      console.error("Error deleting image:", error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      message: "Image deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    return { success: false, error: "Failed to delete image" }
  }
}
