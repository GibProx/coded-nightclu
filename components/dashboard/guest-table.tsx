import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface GuestTableProps {
  guests: any[]
}

export function GuestTable({ guests }: GuestTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Guest</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Visits</TableHead>
          <TableHead>Last Visit</TableHead>
          <TableHead>Total Spend</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.map((guest) => (
          <TableRow key={guest.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage alt={guest.name} />
                  <AvatarFallback>{guest.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-0.5">
                  <div className="font-medium">{guest.name}</div>
                  <div className="text-xs text-muted-foreground">{guest.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={guest.status === "VIP" ? "destructive" : "outline"}>{guest.status}</Badge>
            </TableCell>
            <TableCell>{guest.visits}</TableCell>
            <TableCell>{guest.lastVisit}</TableCell>
            <TableCell>{guest.spendTotal}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
