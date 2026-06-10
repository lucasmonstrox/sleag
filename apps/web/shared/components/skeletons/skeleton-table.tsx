import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"

import { SkeletonSparkline } from "./skeleton-sparkline"

const TEXT_WIDTHS = ["w-24", "w-32", "w-16", "w-20", "w-28", "w-14", "w-36", "w-24"]
const NUMBER_WIDTHS = ["w-14", "w-16", "w-12", "w-20", "w-14", "w-16"]
const BADGE_WIDTHS = ["w-16", "w-20", "w-14", "w-24"]

export type SkeletonColumn = {
  header: string
  cell?:
    | "text"
    | "badge"
    | "avatar"
    | "media"
    | "sparkline"
    | "score"
    | "switch"
    | "actions"
    | "rank"
  align?: "left" | "right" | "center"
  className?: string
}

type SkeletonTableProps = {
  columns: SkeletonColumn[]
  rows?: number
  /** Sem moldura própria — para uso dentro de um Card. */
  bare?: boolean
  className?: string
}

export function SkeletonTable({
  columns,
  rows = 8,
  bare = false,
  className,
}: SkeletonTableProps) {
  return (
    <div
      className={cn(
        !bare && "overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.header}
                className={cn(alignClass(column.align), column.className)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="h-12 hover:bg-transparent">
              {columns.map((column, columnIndex) => (
                <TableCell
                  key={column.header}
                  className={cn(alignClass(column.align), column.className)}
                >
                  <CellSkeleton
                    type={column.cell ?? "text"}
                    row={rowIndex}
                    col={columnIndex}
                    align={column.align}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function alignClass(align?: SkeletonColumn["align"]) {
  if (align === "right") return "text-right"
  if (align === "center") return "text-center"
  return undefined
}

type CellSkeletonProps = {
  type: NonNullable<SkeletonColumn["cell"]>
  row: number
  col: number
  align?: SkeletonColumn["align"]
}

function CellSkeleton({ type, row, col, align }: CellSkeletonProps) {
  const widths = align === "right" ? NUMBER_WIDTHS : TEXT_WIDTHS
  const width = widths[(row * 3 + col) % widths.length]
  const wrapper = cn(
    "flex items-center",
    align === "right" && "justify-end",
    align === "center" && "justify-center",
  )

  switch (type) {
    case "rank":
      return (
        <span className="font-mono text-sm text-muted-foreground/70">{row + 1}</span>
      )
    case "badge":
      return (
        <div className={wrapper}>
          <Skeleton
            className={cn(
              "h-5 rounded-full",
              BADGE_WIDTHS[(row + col) % BADGE_WIDTHS.length],
            )}
          />
        </div>
      )
    case "avatar":
    case "media":
      return (
        <div className="flex items-center gap-3">
          <Skeleton
            className={cn(
              "shrink-0",
              type === "avatar" ? "size-8 rounded-full" : "size-9 rounded-md",
            )}
          />
          <div className="flex flex-col gap-1.5">
            <Skeleton className={cn("h-4", width)} />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      )
    case "sparkline":
      return (
        <div className={wrapper}>
          <SkeletonSparkline />
        </div>
      )
    case "score":
      return (
        <div className={cn(wrapper, "gap-2")}>
          <Skeleton className="h-4 w-7" />
          <Skeleton className="h-1.5 w-14 rounded-full" />
        </div>
      )
    case "switch":
      return (
        <div className={wrapper}>
          <Skeleton className="h-5 w-9 rounded-full" />
        </div>
      )
    case "actions":
      return (
        <div className={cn(wrapper, "justify-end")}>
          <Skeleton className="size-8" />
        </div>
      )
    default:
      return (
        <div className={wrapper}>
          <Skeleton className={cn("h-4", width)} />
        </div>
      )
  }
}
