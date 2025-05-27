"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { setupDatabase } from "@/app/actions/database-actions"

export default function EventsSetupPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSetupEvents() {
    setIsLoading(true)
    setError(null)

    try {
      const result = await setupDatabase("lib/sql/update-events-table-tickets.sql")

      if (result.success) {
        setSetupComplete(true)
        toast({
          title: "Success",
          description: "Events database has been updated successfully.",
        })
      } else {
        setError(result.error || "Failed to update events database")
        toast({
          title: "Error",
          description: result.error || "Failed to update events database",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error setting up events database:", err)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the events database",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSetupFatsoma() {
    setIsLoading(true)
    setError(null)

    try {
      const result = await setupDatabase("lib/sql/update-events-fatsoma.sql")

      if (result.success) {
        setSetupComplete(true)
        toast({
          title: "Success",
          description: "Fatsoma integration has been added successfully.",
        })
      } else {
        setError(result.error || "Failed to add Fatsoma integration")
        toast({
          title: "Error",
          description: result.error || "Failed to add Fatsoma integration",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error setting up Fatsoma integration:", err)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding Fatsoma integration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Events Setup</h1>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
          <TabsTrigger value="setup">Database Setup</TabsTrigger>
          <TabsTrigger value="fatsoma">Fatsoma Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Events Database</CardTitle>
              <CardDescription>
                Update the events table to support ticket categories and other new features
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {setupComplete ? (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Setup Complete</AlertTitle>
                  <AlertDescription className="text-green-700">
                    The events database has been updated successfully. You can now use all the new features.
                  </AlertDescription>
                </Alert>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  This will update your events table to support ticket categories, long descriptions, and image
                  galleries. This is required for the new event features to work properly.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSetupEvents} disabled={isLoading || setupComplete} className="w-full md:w-auto">
                {isLoading ? "Updating..." : setupComplete ? "Updated" : "Update Events Database"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="fatsoma" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Fatsoma Integration</CardTitle>
              <CardDescription>Add Fatsoma integration fields to support external ticketing</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {setupComplete ? (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Setup Complete</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Fatsoma integration has been added successfully. You can now use external ticketing features.
                  </AlertDescription>
                </Alert>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  This will add Fatsoma integration fields to your events table, allowing you to redirect customers to
                  Fatsoma for ticket purchases.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSetupFatsoma} disabled={isLoading || setupComplete} className="w-full md:w-auto">
                {isLoading ? "Adding..." : setupComplete ? "Added" : "Add Fatsoma Integration"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
