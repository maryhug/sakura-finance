"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

interface DashboardShellProps {
  user: { name?: string | null; email?: string | null; image?: string | null }
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function DashboardShell({ user, title, subtitle, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden petal-bg">
      <Sidebar user={user} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">{children}</main>
      </div>
    </div>
  )
}
