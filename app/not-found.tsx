import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-6">
          <Icons.folderClosed className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">404 - Page Not Found</h1>
        <p className="mb-6 text-muted-foreground">The page you are looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
