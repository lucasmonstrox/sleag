import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

import { AppSidebar, AppTopbar } from "@/features/shell"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-svh overflow-hidden">
          <AppTopbar />
          <ScrollArea className="min-h-0 flex-1">{children}</ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
