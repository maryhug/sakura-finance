"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toast, useToast } from "@/components/ui/toast"
import { savingsGoalSchema, type SavingsGoalInput } from "@/lib/validations"
import { createSavingsGoal, updateSavingsGoal } from "@/actions/savings"
import { CATEGORY_COLORS } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { SavingsGoal } from "@prisma/client"

const ICONS = [
  { id: "piggy-bank", emoji: "🐷" },
  { id: "house", emoji: "🏠" },
  { id: "car", emoji: "🚗" },
  { id: "plane", emoji: "✈️" },
  { id: "laptop", emoji: "💻" },
  { id: "ring", emoji: "💍" },
  { id: "baby", emoji: "👶" },
  { id: "heart", emoji: "💕" },
  { id: "star", emoji: "⭐" },
  { id: "gift", emoji: "🎁" },
]

interface Props {
  goal?: SavingsGoal
  onSuccess?: () => void
  redirectOnSuccess?: string
}

export function SavingsGoalForm({ goal, onSuccess, redirectOnSuccess }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { toast, show, hide } = useToast()
  const [selectedIcon, setSelectedIcon] = useState(goal?.icon ?? "piggy-bank")
  const [selectedColor, setSelectedColor] = useState(goal?.color ?? "#f472b6")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SavingsGoalInput>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: goal?.name ?? "",
      targetAmount: goal ? String(goal.targetAmount) : "",
      currentAmount: goal ? String(goal.currentAmount) : "0",
      deadline: goal?.deadline ? format(new Date(goal.deadline), "yyyy-MM-dd") : "",
      icon: goal?.icon ?? "piggy-bank",
      color: goal?.color ?? "#f472b6",
    },
  })

  function selectIcon(id: string) {
    setSelectedIcon(id)
    setValue("icon", id)
  }

  function selectColor(color: string) {
    setSelectedColor(color)
    setValue("color", color)
  }

  function onSubmit(data: SavingsGoalInput) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => v !== undefined && v !== "" && formData.append(k, v as string))

      const result = goal
        ? await updateSavingsGoal(goal.id, formData)
        : await createSavingsGoal(formData)

      if (result.success) {
        show(goal ? "Meta actualizada ✿" : "Meta creada ✿", "success")
        setTimeout(() => {
          if (redirectOnSuccess) router.push(redirectOnSuccess)
          else onSuccess?.()
        }, 600)
      } else {
        show(result.error ?? "Error inesperado", "error")
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Nombre de la meta" placeholder="ej. Viaje a Japón, Fondo de emergencia..." error={errors.name?.message} {...register("name")} />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Meta ($)" type="number" step="0.01" min="0.01" placeholder="0.00" error={errors.targetAmount?.message} {...register("targetAmount")} />
          <Input label="Ya ahorrado ($)" type="number" step="0.01" min="0" placeholder="0.00" error={errors.currentAmount?.message} {...register("currentAmount")} />
        </div>

        <Input label="Fecha límite (opcional)" type="date" {...register("deadline")} />

        {/* Icon picker */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-muted)] mb-2">Ícono</p>
          <div className="flex flex-wrap gap-2">
            {ICONS.map((ic) => (
              <button
                key={ic.id}
                type="button"
                onClick={() => selectIcon(ic.id)}
                className={cn(
                  "w-10 h-10 rounded-xl text-xl transition-all",
                  selectedIcon === ic.id
                    ? "bg-sakura-100 border-2 border-sakura-400 scale-110"
                    : "bg-[var(--surface-2)] hover:bg-sakura-50 border border-[var(--border)]"
                )}
              >
                {ic.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-muted)] mb-2">Color</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => selectColor(color)}
                className={cn(
                  "w-7 h-7 rounded-full transition-all",
                  selectedColor === color && "ring-2 ring-offset-2 ring-[var(--primary)] scale-110"
                )}
                style={{ background: color }}
              />
            ))}
          </div>
        </div>

        <input type="hidden" {...register("icon")} value={selectedIcon} />
        <input type="hidden" {...register("color")} value={selectedColor} />

        <Button type="submit" className="w-full" loading={isPending}>
          {goal ? "Guardar cambios" : "Crear meta"}
        </Button>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </>
  )
}
