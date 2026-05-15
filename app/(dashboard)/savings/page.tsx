import type { Metadata } from "next"
import { getSavingsGoals } from "@/actions/savings"
import { PageHeader } from "@/components/layout/page-header"
import { SavingsGoalCard } from "@/components/savings/savings-goal-card"
import { EmptyState } from "@/components/ui/empty-state"
import { AddSavingsGoalButton } from "@/components/savings/add-savings-goal-button"
import { formatCurrency, toDecimal } from "@/lib/utils"

export const metadata: Metadata = { title: "Metas de ahorro" }

export default async function SavingsPage() {
  const goals = await getSavingsGoals()

  const totalTarget = goals.reduce((a, g) => a + toDecimal(g.targetAmount), 0)
  const totalSaved = goals.reduce((a, g) => a + toDecimal(g.currentAmount), 0)
  const active = goals.filter((g) => g.status === "ACTIVE")
  const completed = goals.filter((g) => g.status === "COMPLETED")

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Metas de ahorro"
        subtitle={`${active.length} activas · ${completed.length} completadas`}
        action={<AddSavingsGoalButton />}
      />

      {goals.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="card-sakura p-4 text-center">
            <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wide">Total objetivo</p>
            <p className="text-lg font-extrabold text-[var(--text)] mt-1">{formatCurrency(totalTarget)}</p>
          </div>
          <div className="card-sakura p-4 text-center">
            <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wide">Total ahorrado</p>
            <p className="text-lg font-extrabold text-[var(--income)] mt-1">{formatCurrency(totalSaved)}</p>
          </div>
          <div className="card-sakura p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wide">Progreso global</p>
            <p className="text-lg font-extrabold text-[var(--primary)] mt-1">
              {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
            </p>
          </div>
        </div>
      )}

      {/* Active goals */}
      {active.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wide mb-3">
            Activas ✿
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {active.map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {/* Completed goals */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wide mb-3">
            Completadas 🎉
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {completed.map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <EmptyState
          icon="🐷"
          title="Sin metas de ahorro aún"
          description="Crea tu primera meta y empieza a ahorrar para lo que sueñas."
          action={<AddSavingsGoalButton />}
        />
      )}
    </div>
  )
}
