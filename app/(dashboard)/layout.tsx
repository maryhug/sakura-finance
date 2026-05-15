import { requireAuth } from "@/lib/session"
import { SidebarProvider } from "@/components/layout/sidebar-provider"

// Provides sidebar shell for all dashboard routes.
// Each page renders its own <PageHeader> as first child.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth()
  return <SidebarProvider user={user}>{children}</SidebarProvider>
}
