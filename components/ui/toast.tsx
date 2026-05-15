"use client"

import * as React from "react"
import { CheckCircle, XCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string
  type?: "success" | "error"
  onClose: () => void
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg animate-scale-in max-w-sm",
        "border backdrop-blur-sm",
        type === "success"
          ? "bg-[var(--income-bg)] border-mint-200 text-mint-600"
          : "bg-[var(--expense-bg)] border-petal-200 text-petal-500"
      )}
    >
      {type === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
      <p className="text-sm font-semibold flex-1">{message}</p>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// Simple hook for toasts
export function useToast() {
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" } | null>(null)

  const show = React.useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
  }, [])

  const hide = React.useCallback(() => setToast(null), [])

  return { toast, show, hide }
}
