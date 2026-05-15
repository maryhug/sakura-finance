import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-14 px-6 gap-4",
        className
      )}
    >
      {icon && (
        <div className="animate-float text-[var(--text-subtle)] opacity-60">{icon}</div>
      )}
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
