import type React from "react"
import Image from "next/image"
import { AlertTriangle, FolderClosed } from "lucide-react"

export const Icons = {
  logo: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div className={className}>
      <Image
        src="/images/coded-logo-light.jpeg"
        alt="CODED Logo"
        width={48}
        height={48}
        className="h-full w-full object-contain"
        {...props}
      />
    </div>
  ),
  logoDark: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div className={className}>
      <Image
        src="/images/coded-logo-dark.jpeg"
        alt="CODED Logo"
        width={48}
        height={48}
        className="h-full w-full object-contain"
        {...props}
      />
    </div>
  ),
  warning: AlertTriangle,
  folderClosed: FolderClosed,
}
