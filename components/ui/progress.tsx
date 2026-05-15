import { cn } from "@/lib/utils"

interface ProgressProps {
  value: number
  max?: number
  className?: string
  color?: string
  showLabel?: boolean
}

export function Progress({ value, max = 100, className, color, showLabel }: ProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn("w-full", className)}>
      <div className="h-2.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: color
              ? `linear-gradient(90deg, ${color}99 0%, ${color} 100%)`
              : "linear-gradient(90deg, #f9a8d4 0%, #f472b6 100%)",
          }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-[var(--text-subtle)] mt-1 text-right">{Math.round(pct)}%</p>
      )}
    </div>
  )
}
