"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash, Star, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  getTicketTemplates,
  createTicketTemplate,
  updateTicketTemplate,
  deleteTicketTemplate,
  initializeTicketTemplates,
  type TicketTemplate,
} from "@/app/actions/ticket-template-actions"

export function TicketTemplateManager() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<TicketTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<TicketTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateDescription, setNewTemplateDescription] = useState("")

  // Load templates on component mount
  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    setIsLoading(true)
    try {
      const data = await getTicketTemplates()
      setTemplates(data)

      // Select the default template or the first one
      const defaultTemplate = data.find((t) => t.is_default)
      setSelectedTemplate(defaultTemplate || (data.length > 0 ? data[0] : null))
    } catch (error) {
      console.error("Error loading templates:", error)
      toast({
        title: "Error",
        description: "Failed to load ticket templates",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleInitializeTemplates() {
    setIsInitializing(true)
    try {
      const result = await initializeTicketTemplates()
      if (result.success) {
        toast({
          title: "Success",
          description: "Ticket templates initialized successfully",
        })
        await loadTemplates()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to initialize ticket templates",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error initializing templates:", error)
      toast({
        title: "Error",
        description: "Failed to initialize ticket templates",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  async function handleCreateTemplate() {
    if (!newTemplateName) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Create a new template with default categories
      const result = await createTicketTemplate(
        newTemplateName,
        [
          {
            name: "General Admission",
            description: "Regular entry tickets",
            tickets: [{ name: "Standard", price: 25, available: true }],
          },
        ],
        newTemplateDescription,
      )

      if (result.success) {
        toast({
          title: "Success",
          description: "Template created successfully",
        })
        setNewTemplateName("")
        setNewTemplateDescription("")
        await loadTemplates()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create template",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating template:", error)
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDuplicateTemplate(template: TicketTemplate) {
    setIsSaving(true)
    try {
      const result = await createTicketTemplate(`${template.name} (Copy)`, template.categories, template.description)

      if (result.success) {
        toast({
          title: "Success",
          description: "Template duplicated successfully",
        })
        await loadTemplates()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to duplicate template",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error duplicating template:", error)
      toast({
        title: "Error",
        description: "Failed to duplicate template",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSetDefaultTemplate(template: TicketTemplate) {
    setIsSaving(true)
    try {
      const result = await updateTicketTemplate(
        template.id,
        template.name,
        template.categories,
        template.description,
        true, // Set as default
      )

      if (result.success) {
        toast({
          title: "Success",
          description: "Default template updated successfully",
        })
        await loadTemplates()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update default template",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating default template:", error)
      toast({
        title: "Error",
        description: "Failed to update default template",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteTemplate(template: TicketTemplate) {
    if (!confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      return
    }

    setIsSaving(true)
    try {
      const result = await deleteTicketTemplate(template.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Template deleted successfully",
        })
        await loadTemplates()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete template",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting template:", error)
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading ticket templates...</div>
  }

  if (templates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ticket Templates</CardTitle>
          <CardDescription>
            No ticket templates found. Initialize the system to create default templates.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleInitializeTemplates} disabled={isInitializing}>
            {isInitializing ? "Initializing..." : "Initialize Ticket Templates"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className={template.is_default ? "border-primary" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {template.name}
                        {template.is_default && <Star className="h-4 w-4 ml-2 text-yellow-500" />}
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-sm text-muted-foreground">
                    {template.categories.length} categories,{" "}
                    {template.categories.reduce((acc, cat) => acc + cat.tickets.length, 0)} ticket types
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    {!template.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefaultTemplate(template)}
                        disabled={isSaving}
                      >
                        <Star className="h-4 w-4 mr-1" /> Set Default
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDuplicateTemplate(template)}
                      disabled={isSaving}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteTemplate(template)}
                      disabled={isSaving}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Template</CardTitle>
              <CardDescription>Create a new ticket template for your events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="templateName" className="block text-sm font-medium mb-1">
                  Template Name
                </label>
                <Input
                  id="templateName"
                  placeholder="e.g., Weekend Events"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="templateDescription" className="block text-sm font-medium mb-1">
                  Description (Optional)
                </label>
                <Textarea
                  id="templateDescription"
                  placeholder="Describe what this template is for..."
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateTemplate} disabled={isSaving || !newTemplateName}>
                {isSaving ? "Creating..." : "Create Template"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
