import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface Column {
  key: string
  title: string
  className?: string
  render?: (value: any, item: any) => React.ReactNode
}

interface ResponsiveTableProps {
  data: any[]
  columns: Column[]
  className?: string
  emptyState?: React.ReactNode
}

export function ResponsiveTable({ data, columns, className, emptyState }: ResponsiveTableProps) {
  if (data.length === 0 && emptyState) {
    return emptyState
  }

  // For mobile view
  const MobileView = (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {data.map((item, i) => (
        <div key={i} className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          {columns.map((column) => (
            <div key={column.key} className="mb-2 grid grid-cols-2 gap-2">
              <div className="font-medium">{column.title}</div>
              <div className={cn("text-right", column.className)}>
                {column.render ? column.render(item[column.key], item) : item[column.key]}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  // For desktop view
  const DesktopView = (
    <div className="hidden md:block overflow-auto">
      <Table className={className}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, i) => (
            <TableRow key={i}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <>
      {MobileView}
      {DesktopView}
    </>
  )
}
