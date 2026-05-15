"use client"

import { Menu, Bell } from "lucide-react"
import { ThemeToggle } from "@/components/layout/theme-toggle"

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick: () => void
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 md:px-6 py-3 flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="font-extrabold text-lg text-[var(--text)] leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-[var(--text-subtle)] truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <button className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
