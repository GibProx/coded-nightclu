import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Card className="w-full max-w-md shadow-2xl text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Icons.logo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">Access Denied</CardTitle>
          <CardDescription>You don't have permission to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">This area is restricted to authorized administrators only.</p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Try Different Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
