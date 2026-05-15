import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "danger" | "soft"
  size?: "sm" | "md" | "lg" | "icon"
  loading?: boolean
}

const variantClass: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-sakura-400 to-sakura-500 text-white shadow-[0_2px_12px_rgba(244,114,182,0.35)] hover:from-sakura-500 hover:to-sakura-600 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(244,114,182,0.5)] active:translate-y-0",
  ghost:
    "bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--primary)] border border-transparent hover:border-[var(--border)]",
  outline:
    "bg-transparent border-2 border-[var(--border-strong)] text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]",
  danger:
    "bg-gradient-to-r from-petal-400 to-petal-500 text-white hover:from-petal-500 hover:to-petal-600 shadow-[0_2px_12px_rgba(244,63,94,0.25)]",
  soft: "bg-[var(--primary-light)] text-[var(--primary)] hover:bg-sakura-100 border border-sakura-200",
}

const sizeClass: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm rounded-full",
  md: "px-5 py-2.5 text-sm rounded-full",
  lg: "px-6 py-3 text-base rounded-full",
  icon: "p-2.5 rounded-full aspect-square",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none",
          variantClass[variant],
          sizeClass[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"
