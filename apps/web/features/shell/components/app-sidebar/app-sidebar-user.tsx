"use client"

import Link from "next/link"
import {
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  SparklesIcon,
} from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"

function UserAvatar({ className }: { className?: string }) {
  return (
    <div
      className={
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-rose-500/20 text-xs font-semibold text-cyan-200 " +
        (className ?? "")
      }
    >
      AS
    </div>
  )
}

export function AppSidebarUser() {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar />
              <div className="flex flex-1 flex-col gap-0.5 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">Ana Souza</span>
                <span className="truncate text-xs text-muted-foreground">
                  ana@exemplo.com.br
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">
                <UserAvatar />
                <div className="flex flex-1 flex-col gap-0.5 text-left leading-tight">
                  <span className="truncate text-sm font-medium">Ana Souza</span>
                  <span className="truncate text-xs text-muted-foreground">
                    ana@exemplo.com.br
                  </span>
                </div>
                <Badge variant="secondary">Pro</Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SparklesIcon />
              Upgrade para Max
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/conta">
                  <SettingsIcon />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/conta">
                  <CreditCardIcon />
                  Plano & cobrança
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
