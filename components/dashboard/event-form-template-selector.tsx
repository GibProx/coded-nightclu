"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTicketTemplates, type TicketTemplate, type TicketCategory } from "@/app/actions/ticket-template-actions"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, LayoutTemplateIcon as Template } from "lucide-react"
import Link from "next/link"

interface EventFormTemplateSelectorProps {
  onSelectTemplate: (categories: TicketCategory[]) => void
}

export function EventFormTemplateSelector({ onSelectTemplate }: EventFormTemplateSelectorProps) {
  const [templates, setTemplates] = useState<TicketTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    setIsLoading(true)
    try {
      const data = await getTicketTemplates()
      setTemplates(data)

      // Find the default template
      const defaultTemplate = data.find((t) => t.is_default)
      if (defaultTemplate) {
        setSelectedTemplateId(defaultTemplate.id)
      }
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

  function handleSelectTemplate(templateId: string) {
    setSelectedTemplateId(templateId)
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      onSelectTemplate(template.categories)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading templates...</span>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">No ticket templates found.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/ticketing/templates">
            <Template className="h-4 w-4 mr-2" />
            Create Templates
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedTemplateId} onValueChange={handleSelectTemplate}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name} {template.is_default && "(Default)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard/ticketing/templates">
          <Template className="h-4 w-4 mr-2" />
          Manage
        </Link>
      </Button>
    </div>
  )
}
