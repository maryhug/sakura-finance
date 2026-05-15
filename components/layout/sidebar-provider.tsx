"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/layout/theme-toggle"

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null }
  children: React.ReactNode
}

// Provides sidebar context to all dashboard routes.
// Each page renders its own page heading inline.
export function SidebarProvider({ user, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden petal-bg">
      <Sidebar user={user} open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Minimal top bar — only visible on mobile for menu toggle */}
        <div className="sticky top-0 z-30 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 py-2.5 flex items-center gap-2 md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-extrabold text-[var(--text)] flex-1">Sakura Finance</span>
          <ThemeToggle />
        </div>
        <div id="dialog-root" className="relative flex-1 overflow-hidden">
          <main className="h-full overflow-y-auto px-4 md:px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
