"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ThemeToggle() {
  // null = not yet mounted (prevents hydration mismatch)
  const [dark, setDark] = useState<boolean | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const stored = localStorage.getItem("sakura-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDark = stored ? stored === "dark" : prefersDark
    document.documentElement.classList.toggle("dark", isDark)
    setDark(isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("sakura-theme", next ? "dark" : "light")
  }

  if (dark === null) return <div className="w-8 h-8" aria-hidden />

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
      title={dark ? "Modo claro" : "Modo oscuro"}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
