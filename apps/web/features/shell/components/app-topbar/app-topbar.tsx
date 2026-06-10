"use client"

import { usePathname } from "next/navigation"
import { BellIcon, SearchIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"

import { findNavMatch } from "../../utils/nav"

export function AppTopbar() {
  const pathname = usePathname()
  const match = findNavMatch(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {match ? (
            <>
              {match.group ? (
                <>
                  <BreadcrumbItem className="hidden text-muted-foreground md:block">
                    {match.group}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              ) : null}
              <BreadcrumbItem>
                <BreadcrumbPage>{match.item.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden w-64 md:block">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            disabled
            placeholder="Buscar produto, criador, loja…"
            className="h-8 pl-9"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#FE2C55]" />
          <span className="sr-only">Notificações</span>
        </Button>
      </div>
    </header>
  )
}
