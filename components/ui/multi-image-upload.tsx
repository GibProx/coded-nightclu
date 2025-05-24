"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadImage, deleteImage } from "@/app/actions/upload-actions"
import { useToast } from "@/components/ui/use-toast"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

interface MultiImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  className?: string
  max?: number
}

interface ImageItem {
  id: string
  url: string
  path?: string
  isUploading?: boolean
}

export function MultiImageUpload({ value, onChange, className = "", max = 10 }: MultiImageUploadProps) {
  const [images, setImages] = useState<ImageItem[]>(
    value.map((url, index) => ({
      id: `image-${index}`,
      url,
    })),
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the maximum
    if (images.length + files.length > max) {
      toast({
        title: "Too many images",
        description: `You can only upload a maximum of ${max} images.`,
        variant: "destructive",
      })
      return
    }

    // Process each file
    const newImages: ImageItem[] = [...images]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const tempId = `temp-${Date.now()}-${i}`
      const objectUrl = URL.createObjectURL(file)

      // Add temporary image with upload indicator
      newImages.push({
        id: tempId,
        url: objectUrl,
        isUploading: true,
      })

      setImages(newImages)

      // Create FormData and upload
      const formData = new FormData()
      formData.append("file", file)

      try {
        const result = await uploadImage(formData)

        if (!result.success) {
          // Remove the temporary image on failure
          setImages((prev) => prev.filter((img) => img.id !== tempId))
          toast({
            title: "Upload failed",
            description: result.error,
            variant: "destructive",
          })
          continue
        }

        // Replace temporary image with actual uploaded image
        setImages((prev) =>
          prev.map((img) =>
            img.id === tempId ? { id: `image-${Date.now()}-${i}`, url: result.url, path: result.path } : img,
          ),
        )
      } catch (error) {
        // Remove the temporary image on error
        setImages((prev) => prev.filter((img) => img.id !== tempId))
        console.error("Error uploading image:", error)
        toast({
          title: "Upload failed",
          description: "There was an error uploading your image.",
          variant: "destructive",
        })
      }
    }

    // Update the parent component with new URLs
    updateParentValue(newImages)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = async (index: number) => {
    const imageToRemove = images[index]

    // Remove from state immediately for UI responsiveness
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)

    // Update parent value
    updateParentValue(newImages)

    // If the image has a path (was uploaded to storage), try to delete it
    if (imageToRemove.path) {
      try {
        await deleteImage(imageToRemove.path)
      } catch (error) {
        console.error("Error deleting image:", error)
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const updateParentValue = (imgs: ImageItem[]) => {
    onChange(imgs.filter((img) => !img.isUploading).map((img) => img.url))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(images)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setImages(items)
    updateParentValue(items)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="gallery-images" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative aspect-square rounded-md overflow-hidden border group"
                    >
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                      />

                      {image.isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemove(index)}
                        disabled={image.isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}

              {images.length < max && (
                <div
                  onClick={triggerFileInput}
                  className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground text-center">Add Image</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <p className="text-xs text-muted-foreground">
        Drag images to reorder. {images.length} of {max} images used.
      </p>
    </div>
  )
}
