import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon = "✿", title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-14 px-6 gap-4",
        className
      )}
    >
      <div className="text-5xl animate-float select-none">{icon}</div>
      <div className="space-y-1">
        <p className="font-bold text-[var(--text)] text-base">{title}</p>
        {description && (
          <p className="text-sm text-[var(--text-subtle)] max-w-xs">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
