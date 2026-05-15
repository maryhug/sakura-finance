import { formatCurrency, formatMonthYear } from "@/lib/utils"
import type { DashboardStats } from "@/types"

export function BalanceCard({ stats }: { stats: DashboardStats }) {
  const now = new Date()

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-[0_8px_32px_rgba(244,114,182,0.35)]"
      style={{ background: "linear-gradient(135deg, #f472b6 0%, #ec4899 40%, #a855f7 100%)" }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -left-6 w-32 h-32 rounded-full bg-white/8" />
      <div className="absolute top-4 right-16 w-16 h-16 rounded-full bg-white/8" />

      <div className="relative">
        <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">Balance total</p>
        <p className="text-4xl font-extrabold mt-1 tracking-tight">
          {formatCurrency(stats.totalBalance)}
        </p>
        <p className="text-sm text-white/60 mt-1 capitalize">{formatMonthYear(now)}</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="bg-white/15 rounded-2xl p-3 backdrop-blur-sm">
            <p className="text-xs text-white/70 font-medium">Ingresos</p>
            <p className="text-base font-bold mt-0.5">{formatCurrency(stats.monthIncome)}</p>
          </div>
          <div className="bg-white/15 rounded-2xl p-3 backdrop-blur-sm">
            <p className="text-xs text-white/70 font-medium">Gastos</p>
            <p className="text-base font-bold mt-0.5">{formatCurrency(stats.monthExpense)}</p>
          </div>
          <div className="bg-white/15 rounded-2xl p-3 backdrop-blur-sm">
            <p className="text-xs text-white/70 font-medium">Ahorrado</p>
            <p className="text-base font-bold mt-0.5">{formatCurrency(stats.monthSavings)}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/70 mb-1.5">
            <span>Tasa de ahorro</span>
            <span className="font-bold text-white">{stats.savingsRate}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(stats.savingsRate, 100)}%`,
                background: "rgba(255,255,255,0.85)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
