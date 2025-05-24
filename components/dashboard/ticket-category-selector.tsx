"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash, Save, Copy, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { getTicketTemplates } from "@/app/actions/ticket-template-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type TicketType = {
  name: string
  price: number
  available: boolean
}

export type TicketCategory = {
  name: string
  description?: string
  tickets: TicketType[]
}

interface TicketCategorySelectorProps {
  value: TicketCategory[]
  onChange: (categories: TicketCategory[]) => void
}

export function TicketCategorySelector({ value, onChange }: TicketCategorySelectorProps) {
  const [categories, setCategories] = useState<TicketCategory[]>(value || [])
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    onChange(categories)
  }, [categories, onChange])

  async function loadTemplates() {
    setIsLoading(true)
    try {
      const data = await getTicketTemplates()
      setTemplates(data)
    } catch (error) {
      console.error("Error loading templates:", error)
      toast({
        title: "Error loading templates",
        description: "There was a problem loading ticket templates. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        name: "New Category",
        description: "",
        tickets: [{ name: "Standard Ticket", price: 25, available: true }],
      },
    ])
    toast({
      title: "Category added",
      description: "A new ticket category has been added.",
    })
  }

  const removeCategory = (index: number) => {
    const newCategories = [...categories]
    const categoryName = newCategories[index].name
    newCategories.splice(index, 1)
    setCategories(newCategories)
    toast({
      title: "Category removed",
      description: `The category "${categoryName}" has been removed.`,
    })
  }

  const updateCategory = (index: number, field: keyof TicketCategory, value: any) => {
    const newCategories = [...categories]
    newCategories[index] = { ...newCategories[index], [field]: value }
    setCategories(newCategories)
  }

  const addTicket = (categoryIndex: number) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].tickets.push({ name: "New Ticket", price: 0, available: true })
    setCategories(newCategories)
    toast({
      title: "Ticket added",
      description: "A new ticket has been added to the category.",
    })
  }

  const removeTicket = (categoryIndex: number, ticketIndex: number) => {
    const newCategories = [...categories]
    const ticketName = newCategories[categoryIndex].tickets[ticketIndex].name
    newCategories[categoryIndex].tickets.splice(ticketIndex, 1)
    setCategories(newCategories)
    toast({
      title: "Ticket removed",
      description: `The ticket "${ticketName}" has been removed.`,
    })
  }

  const updateTicket = (categoryIndex: number, ticketIndex: number, field: keyof TicketType, value: any) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].tickets[ticketIndex] = {
      ...newCategories[categoryIndex].tickets[ticketIndex],
      [field]: value,
    }
    setCategories(newCategories)
  }

  const duplicateCategory = (index: number) => {
    const categoryToDuplicate = categories[index]
    const newCategory = JSON.parse(JSON.stringify(categoryToDuplicate))
    newCategory.name = `${newCategory.name} (Copy)`
    setCategories([...categories, newCategory])
    toast({
      title: "Category duplicated",
      description: `A copy of "${categoryToDuplicate.name}" has been created.`,
    })
  }

  const loadTemplate = async (templateId: string) => {
    if (!templateId) return

    try {
      const template = templates.find((t) => t.id === templateId)
      if (template) {
        // Parse categories if they're stored as a string
        let templateCategories = template.categories
        if (typeof templateCategories === "string") {
          templateCategories = JSON.parse(templateCategories)
        }

        setCategories(templateCategories)
        toast({
          title: "Template Loaded",
          description: `Loaded template: ${template.name}`,
        })
      }
    } catch (error) {
      console.error("Error loading template:", error)
      toast({
        title: "Error",
        description: "Failed to load template",
        variant: "destructive",
      })
    }
  }

  const saveAsTemplate = async () => {
    try {
      const templateName = prompt("Enter a name for this template:")
      if (!templateName) return

      const response = await fetch("/api/ticket-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: templateName,
          categories: categories,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Template saved successfully",
        })
        loadTemplates() // Refresh templates
      } else {
        toast({
          title: "Error",
          description: "Failed to save template",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving template:", error)
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Ticket Categories</h3>
        <div className="flex space-x-2">
          {templates.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select
                      value={selectedTemplate}
                      onValueChange={(value) => {
                        setSelectedTemplate(value)
                        loadTemplate(value)
                      }}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Load template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Load a pre-defined set of ticket categories</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="outline" size="sm" onClick={saveAsTemplate}>
                  <Save className="h-4 w-4 mr-2" /> Save Template
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save current ticket categories as a template for future use</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button type="button" variant="default" size="sm" onClick={addCategory}>
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No ticket categories added yet</p>
          <Button type="button" onClick={addCategory}>
            <Plus className="h-4 w-4 mr-2" /> Add Your First Category
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="border-2 border-primary/10 shadow-sm">
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1 mr-4">
                    <Label htmlFor={`category-name-${categoryIndex}`}>Category Name</Label>
                    <Input
                      id={`category-name-${categoryIndex}`}
                      value={category.name}
                      onChange={(e) => updateCategory(categoryIndex, "name", e.target.value)}
                      placeholder="e.g., General Admission"
                      className="bg-white"
                    />
                  </div>
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => duplicateCategory(categoryIndex)}
                            title="Duplicate category"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Duplicate this category</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCategory(categoryIndex)}
                            title="Remove category"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove this category</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`category-desc-${categoryIndex}`}>Description</Label>
                  <Input
                    id={`category-desc-${categoryIndex}`}
                    value={category.description || ""}
                    onChange={(e) => updateCategory(categoryIndex, "description", e.target.value)}
                    placeholder="e.g., Standard entry tickets"
                    className="bg-white"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium">Tickets</h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add different ticket types with their own prices and availability</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => addTicket(categoryIndex)}>
                      <Plus className="h-4 w-4 mr-2" /> Add Ticket
                    </Button>
                  </div>

                  {category.tickets.length === 0 ? (
                    <div className="text-center p-4 border border-dashed rounded-lg">
                      <p className="text-muted-foreground text-sm">No tickets in this category</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {category.tickets.map((ticket, ticketIndex) => (
                        <div
                          key={ticketIndex}
                          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border p-3 rounded-md bg-white"
                        >
                          <div className="md:col-span-5">
                            <Label className="text-xs">Ticket Name</Label>
                            <Input
                              value={ticket.name}
                              onChange={(e) => updateTicket(categoryIndex, ticketIndex, "name", e.target.value)}
                              placeholder="e.g., Early Bird"
                            />
                          </div>

                          <div className="md:col-span-3">
                            <Label className="text-xs">Price (£)</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={ticket.price}
                              onChange={(e) =>
                                updateTicket(
                                  categoryIndex,
                                  ticketIndex,
                                  "price",
                                  e.target.value === "" ? 0 : Number(e.target.value),
                                )
                              }
                            />
                          </div>

                          <div className="md:col-span-3 flex items-center space-x-2">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`ticket-available-${categoryIndex}-${ticketIndex}`}
                                checked={ticket.available}
                                onCheckedChange={(checked) =>
                                  updateTicket(categoryIndex, ticketIndex, "available", checked)
                                }
                              />
                              <Label htmlFor={`ticket-available-${categoryIndex}-${ticketIndex}`} className="text-xs">
                                {ticket.available ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Available
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    Sold Out
                                  </Badge>
                                )}
                              </Label>
                            </div>
                          </div>

                          <div className="md:col-span-1 flex justify-end">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeTicket(categoryIndex, ticketIndex)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Remove this ticket</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {categories.length > 0 && (
        <Alert className="mt-4 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Your ticket categories will be saved when you submit the event form. Make sure to click "Create Event" or
            "Update Event" to save your changes.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
