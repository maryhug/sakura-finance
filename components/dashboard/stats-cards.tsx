import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { DashboardStats } from "@/types"

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  bg: string
  text: string
  note?: string
}

function StatCard({ title, value, icon, bg, text, note }: StatCardProps) {
  return (
    <Card className="group">
      <CardContent className="flex items-start gap-4 pt-5">
        <div className={cn("p-3 rounded-2xl shrink-0 transition-transform group-hover:scale-110", bg)}>
          <span className={text}>{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wide">{title}</p>
          <p className="text-xl font-extrabold text-[var(--text)] mt-0.5 truncate">
            {formatCurrency(value)}
          </p>
          {note && <p className="text-xs text-[var(--text-subtle)] mt-0.5">{note}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        title="Balance total"
        value={stats.totalBalance}
        icon={<Wallet className="h-5 w-5" />}
        bg="bg-sakura-100"
        text="text-sakura-600"
        note="Todo el tiempo"
      />
      <StatCard
        title="Ingresos del mes"
        value={stats.monthIncome}
        icon={<TrendingUp className="h-5 w-5" />}
        bg="bg-mint-100"
        text="text-mint-600"
        note="Este mes"
      />
      <StatCard
        title="Gastos del mes"
        value={stats.monthExpense}
        icon={<TrendingDown className="h-5 w-5" />}
        bg="bg-petal-100"
        text="text-petal-500"
        note="Este mes"
      />
      <StatCard
        title="Ahorro del mes"
        value={stats.monthSavings}
        icon={<PiggyBank className="h-5 w-5" />}
        bg="bg-lavender-100"
        text="text-lavender-600"
        note={`${stats.savingsRate}% de ahorro`}
      />
    </div>
  )
}
