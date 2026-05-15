import { ThemeToggle } from "@/components/layout/theme-toggle"

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">{title}</h1>
        {subtitle && <p className="text-sm text-[var(--text-subtle)] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
        {action}
      </div>
    </div>
  )
}
