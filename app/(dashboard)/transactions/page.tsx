import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Suspense } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getTransactions } from "@/actions/transactions"
import { getCategories } from "@/actions/categories"
import { getSavingsGoals } from "@/actions/savings"
import type { TransactionType, GoalStatus } from "@/types"
import { formatCurrency, toDecimal } from "@/lib/utils"

export const metadata: Metadata = { title: "Movimientos" }

interface Props {
  searchParams: Promise<{ type?: string; categoryId?: string; month?: string }>
}

export default async function TransactionsPage({ searchParams }: Props) {
  const params = await searchParams
  const { type, categoryId, month } = params

  // Build date range from month param (format: yyyy-MM)
  let from: Date | undefined
  let to: Date | undefined
  if (month) {
    const [y, m] = month.split("-").map(Number)
    from = new Date(y, m - 1, 1)
    to = new Date(y, m, 0, 23, 59, 59)
  }

  const [transactions, categories, rawGoals] = await Promise.all([
    getTransactions({
      type: type ? (type as TransactionType) : undefined,
      categoryId: categoryId || undefined,
      from,
      to,
    }),
    getCategories(),
    getSavingsGoals(),
  ])

  const savingsGoals = rawGoals.map((g) => ({ id: g.id, name: g.name, status: g.status as GoalStatus }))

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((a, t) => a + toDecimal(t.amount), 0)
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((a, t) => a + toDecimal(t.amount), 0)

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Movimientos"
        subtitle={`${transactions.length} registros encontrados`}
        action={
          <Link href="/transactions/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Nuevo
            </Button>
          </Link>
        }
      />

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-mint-50 border border-mint-200 rounded-2xl px-4 py-2">
          <span className="text-xs font-semibold text-mint-600">Ingresos</span>
          <span className="text-sm font-extrabold text-mint-600">{formatCurrency(totalIncome)}</span>
        </div>
        <div className="flex items-center gap-2 bg-petal-50 border border-petal-200 rounded-2xl px-4 py-2">
          <span className="text-xs font-semibold text-petal-500">Gastos</span>
          <span className="text-sm font-extrabold text-petal-500">{formatCurrency(totalExpense)}</span>
        </div>
        <div className="flex items-center gap-2 bg-sakura-50 border border-sakura-200 rounded-2xl px-4 py-2">
          <span className="text-xs font-semibold text-sakura-600">Balance</span>
          <span className="text-sm font-extrabold text-sakura-600">
            {formatCurrency(totalIncome - totalExpense)}
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-5">
          <Suspense>
            <TransactionFilters categories={categories} />
          </Suspense>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardContent className="pt-5">
          <TransactionList transactions={transactions} categories={categories} savingsGoals={savingsGoals} />
        </CardContent>
      </Card>
    </div>
  )
}
