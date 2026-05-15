"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Input, Textarea, Select } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toast, useToast } from "@/components/ui/toast"
import { transactionSchema, type TransactionInput } from "@/lib/validations"
import { createTransaction, updateTransaction } from "@/actions/transactions"
import { cn } from "@/lib/utils"
import type { Category, Transaction } from "@prisma/client"

interface Props {
  categories: Category[]
  transaction?: Transaction
  onSuccess?: () => void
}

export function TransactionForm({ categories, transaction, onSuccess }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { toast, show, hide } = useToast()
  const [txType, setTxType] = useState<"INCOME" | "EXPENSE">(
    (transaction?.type as "INCOME" | "EXPENSE") ?? "EXPENSE"
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction?.description ?? "",
      amount: transaction ? String(transaction.amount) : "",
      type: (transaction?.type as "INCOME" | "EXPENSE") ?? "EXPENSE",
      categoryId: transaction?.categoryId ?? "",
      date: transaction
        ? format(new Date(transaction.date), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      notes: transaction?.notes ?? "",
    },
  })

  const filteredCategories = categories.filter((c) => c.type === txType)

  function handleTypeChange(type: "INCOME" | "EXPENSE") {
    setTxType(type)
    setValue("type", type)
    setValue("categoryId", "")
  }

  function onSubmit(data: TransactionInput) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => v && formData.append(k, v as string))

      const result = transaction
        ? await updateTransaction(transaction.id, formData)
        : await createTransaction(formData)

      if (result.success) {
        show(transaction ? "Movimiento actualizado ✿" : "Movimiento creado ✿", "success")
        setTimeout(() => {
          onSuccess?.()
          router.push("/transactions")
          router.refresh()
        }, 600)
      } else {
        show(result.error ?? "Error inesperado", "error")
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Type toggle */}
        <div className="flex gap-2 p-1 bg-[var(--surface-2)] rounded-2xl">
          {(["EXPENSE", "INCOME"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                txType === type
                  ? type === "INCOME"
                    ? "bg-mint-500 text-white shadow-sm"
                    : "bg-petal-400 text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface)]"
              )}
            >
              {type === "INCOME" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {type === "INCOME" ? "Ingreso" : "Gasto"}
            </button>
          ))}
        </div>

        <input type="hidden" {...register("type")} value={txType} />

        {/* Description */}
        <Input
          label="Descripción"
          placeholder="ej. Salario, supermercado, Netflix..."
          error={errors.description?.message}
          {...register("description")}
        />

        {/* Amount */}
        <Input
          label="Monto"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          leftIcon={<span className="text-xs font-bold">$</span>}
          {...register("amount")}
        />

        {/* Date */}
        <Input
          label="Fecha"
          type="date"
          error={errors.date?.message}
          {...register("date")}
        />

        {/* Category */}
        <Select
          label="Categoría (opcional)"
          error={errors.categoryId?.message}
          {...register("categoryId")}
        >
          <option value="">Sin categoría</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>

        {/* Notes */}
        <Textarea
          label="Notas (opcional)"
          placeholder="Algún detalle adicional..."
          {...register("notes")}
        />

        <Button type="submit" className="w-full" loading={isPending}>
          {transaction ? "Guardar cambios" : "Registrar movimiento"}
        </Button>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </>
  )
}
