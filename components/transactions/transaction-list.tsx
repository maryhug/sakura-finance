import { TransactionItem } from "@/components/transactions/transaction-item"
import { EmptyState } from "@/components/ui/empty-state"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { TransactionWithCategory } from "@/types"
import type { Category } from "@prisma/client"

interface Props {
  transactions: TransactionWithCategory[]
  categories: Category[]
}

export function TransactionList({ transactions, categories }: Props) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon="💸"
        title="Sin movimientos"
        description="Registra un ingreso o gasto para empezar."
        action={
          <Link href="/transactions/new">
            <Button>+ Nuevo movimiento</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-1">
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} categories={categories} />
      ))}
    </div>
  )
}
