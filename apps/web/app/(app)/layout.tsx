import { redirect } from "next/navigation"

import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

import { getSessionUser } from "@/lib/supabase/user"
import { AppSidebar, AppTopbar } from "@/features/shell"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset className="h-svh overflow-hidden">
          <AppTopbar />
          <ScrollArea className="min-h-0 flex-1">{children}</ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
