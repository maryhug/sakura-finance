import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCategories } from "@/actions/categories"
import { getSavingsGoals } from "@/actions/savings"
import type { GoalStatus } from "@/types"

export const metadata: Metadata = { title: "Nuevo movimiento" }

export default async function NewTransactionPage() {
  const [categories, rawGoals] = await Promise.all([getCategories(), getSavingsGoals()])

  const savingsGoals = rawGoals.map((g) => ({ id: g.id, name: g.name, status: g.status as GoalStatus }))

  return (
    <div className="space-y-5 animate-fade-in max-w-lg mx-auto">
      <PageHeader
        title="Nuevo movimiento"
        subtitle="Registra un ingreso o gasto"
        action={
          <Link href="/transactions">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="pt-5">
          <TransactionForm categories={categories} savingsGoals={savingsGoals} />
        </CardContent>
      </Card>
    </div>
  )
}
