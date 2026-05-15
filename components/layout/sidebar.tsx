"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  PiggyBank,
  LogOut,
  X,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { logout } from "@/actions/auth"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/transactions", label: "Movimientos", icon: <ArrowLeftRight className="h-4 w-4" /> },
  { href: "/categories", label: "Categorías", icon: <Tag className="h-4 w-4" /> },
  { href: "/savings", label: "Metas de ahorro", icon: <PiggyBank className="h-4 w-4" /> },
]

interface SidebarProps {
  user: { name?: string | null; email?: string | null; image?: string | null }
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ user, open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full sidebar flex flex-col",
          "bg-[var(--surface)] border-r border-[var(--border)] shadow-[var(--shadow-card)]",
          "transition-transform duration-300 ease-in-out",
          "md:translate-x-0 md:relative md:shadow-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sakura-300 to-sakura-500 flex items-center justify-center shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-extrabold text-base text-[var(--text)] leading-none">Sakura</p>
              <p className="text-xs text-[var(--text-subtle)] leading-none mt-0.5">Finance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <p className="px-3 text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider mb-3">
            Menú
          </p>
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                  active
                    ? "bg-gradient-to-r from-sakura-400 to-sakura-500 text-white shadow-[0_2px_8px_rgba(244,114,182,0.3)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--primary)]"
                )}
              >
                <span className={cn(active ? "text-white" : "text-[var(--text-subtle)]")}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Decorative */}
        <div className="mx-4 mb-3 p-3 rounded-2xl bg-gradient-to-br from-sakura-50 to-petal-50 border border-sakura-100 text-center">
          <div className="flex justify-center animate-float text-sakura-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-sakura-600 mt-1">¡Hola, {user.name?.split(" ")[0] ?? "amiga"}!</p>
          <p className="text-xs text-[var(--text-subtle)]">Cuida tus finanzas</p>
        </div>

        {/* User */}
        <div className="px-4 pb-4 border-t border-[var(--border)] pt-3">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} image={user.image} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text)] truncate">
                {user.name ?? "Usuario"}
              </p>
              <p className="text-xs text-[var(--text-subtle)] truncate">{user.email}</p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="p-2 rounded-full hover:bg-petal-50 hover:text-petal-500 text-[var(--text-subtle)] transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}
