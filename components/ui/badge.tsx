import { cn } from "@/lib/utils"

type BadgeVariant = "income" | "expense" | "default" | "soft" | "outline"

const variantClass: Record<BadgeVariant, string> = {
  income: "bg-[var(--income-bg)] text-[var(--income)] border border-mint-200",
  expense: "bg-[var(--expense-bg)] text-[var(--expense)] border border-petal-200",
  default: "bg-sakura-100 text-sakura-700 border border-sakura-200",
  soft: "bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]",
  outline: "bg-transparent text-[var(--text-muted)] border border-[var(--border-strong)]",
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variantClass[variant],
        className
      )}
      {...props}
    />
  )
}
