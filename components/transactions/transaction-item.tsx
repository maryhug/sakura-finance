"use client"

import { useState, useTransition } from "react"
import { TrendingUp, TrendingDown, Pencil, Trash2, PiggyBank } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Toast, useToast } from "@/components/ui/toast"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { deleteTransaction } from "@/actions/transactions"
import { formatCurrency, formatDate, cn } from "@/lib/utils"
import type { TransactionWithCategory } from "@/types"
import type { Category } from "@prisma/client"
import type { GoalOption } from "@/types"

interface Props {
  transaction: TransactionWithCategory
  categories: Category[]
  savingsGoals?: GoalOption[]
}

export function TransactionItem({ transaction, categories, savingsGoals = [] }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast, show, hide } = useToast()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTransaction(transaction.id)
      if (result.success) {
        show("Movimiento eliminado", "success")
        setDeleteOpen(false)
      } else {
        show(result.error ?? "Error al eliminar", "error")
      }
    })
  }

  const isIncome = transaction.type === "INCOME"

  return (
    <>
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors group">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            isIncome ? "bg-mint-100 text-mint-600" : "bg-petal-100 text-petal-500"
          )}
        >
          {isIncome ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text)] truncate">{transaction.description}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-[var(--text-subtle)]">{formatDate(transaction.date)}</span>
            {transaction.category && (
              <Badge
                variant="soft"
                className="text-xs py-0"
                style={{ borderColor: transaction.category.color + "40", color: transaction.category.color }}
              >
                {transaction.category.name}
              </Badge>
            )}
            {transaction.savingsGoal && (
              <Badge variant="soft" className="text-xs py-0 gap-1 text-sakura-500 border-sakura-200">
                <PiggyBank className="h-3 w-3" />
                {transaction.savingsGoal.name}
              </Badge>
            )}
            {transaction.notes && (
              <span className="text-xs text-[var(--text-subtle)] italic truncate max-w-[120px]">
                {transaction.notes}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-extrabold",
              isIncome ? "text-[var(--income)]" : "text-[var(--expense)]"
            )}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(parseFloat(String(transaction.amount)))}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditOpen(true)}
              className="h-7 w-7"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteOpen(true)}
              className="h-7 w-7 hover:bg-petal-50 hover:text-petal-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar movimiento</DialogTitle>
          <DialogClose onClose={() => setEditOpen(false)} />
        </DialogHeader>
        <TransactionForm
          categories={categories}
          savingsGoals={savingsGoals}
          transaction={transaction}
          onSuccess={() => setEditOpen(false)}
        />
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogHeader>
          <DialogTitle>¿Eliminar movimiento?</DialogTitle>
          <DialogClose onClose={() => setDeleteOpen(false)} />
        </DialogHeader>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          Se eliminará permanentemente <strong>{transaction.description}</strong>.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setDeleteOpen(false)}>
            Cancelar
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete} loading={isPending}>
            Eliminar
          </Button>
        </div>
      </Dialog>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </>
  )
}
