import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { MonthlyChart } from "@/components/dashboard/monthly-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { Button } from "@/components/ui/button"
import {
  getDashboardStats,
  getMonthlyData,
  getCategorySpending,
  getTransactions,
} from "@/actions/transactions"
import { requireAuth } from "@/lib/session"

export const metadata: Metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const user = await requireAuth()

  const [stats, monthlyData, categorySpending, recentTx] = await Promise.all([
    getDashboardStats(),
    getMonthlyData(6),
    getCategorySpending(),
    getTransactions({ from: undefined, to: undefined }),
  ])

  const recent = recentTx.slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Hola, ${user.name?.split(" ")[0] ?? "amiga"} ✿`}
        subtitle="Aquí está el resumen de tus finanzas"
        action={
          <Link href="/transactions/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Nuevo
            </Button>
          </Link>
        }
      />

      {/* Balance hero */}
      <BalanceCard stats={stats} />

      {/* Stats grid */}
      <StatsCards stats={stats} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyChart data={monthlyData} />
        <SpendingChart data={categorySpending} />
      </div>

      {/* Recent transactions */}
      <RecentTransactions transactions={recent} />
    </div>
  )
}
