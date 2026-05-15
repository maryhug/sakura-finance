"use client"

import { useState, useTransition } from "react"
import { Pencil, Trash2, Check, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Toast, useToast } from "@/components/ui/toast"
import { SavingsGoalForm } from "@/components/savings/savings-goal-form"
import { deleteSavingsGoal, markGoalCompleted } from "@/actions/savings"
import { formatCurrency, formatDate, toDecimal } from "@/lib/utils"
import type { SavingsGoal } from "@prisma/client"

const GOAL_ICONS: Record<string, string> = {
  "piggy-bank": "🐷",
  house: "🏠",
  car: "🚗",
  plane: "✈️",
  laptop: "💻",
  ring: "💍",
  baby: "👶",
  heart: "💕",
  star: "⭐",
  gift: "🎁",
}

function getGoalEmoji(icon: string): string {
  return GOAL_ICONS[icon] ?? "🎯"
}

interface Props {
  goal: SavingsGoal
}

export function SavingsGoalCard({ goal }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast, show, hide } = useToast()

  const target = toDecimal(goal.targetAmount)
  const current = toDecimal(goal.currentAmount)
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0
  const remaining = Math.max(target - current, 0)
  const isComplete = goal.status === "COMPLETED" || progress >= 100

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteSavingsGoal(goal.id)
      if (result.success) {
        show("Meta eliminada", "success")
        setDeleteOpen(false)
      } else {
        show(result.error ?? "Error al eliminar", "error")
      }
    })
  }

  function handleComplete() {
    startTransition(async () => {
      const result = await markGoalCompleted(goal.id)
      if (result.success) show("¡Meta completada! 🎉", "success")
      else show(result.error ?? "Error", "error")
    })
  }

  return (
    <>
      <Card className="group overflow-hidden">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ background: goal.color + "20", border: `2px solid ${goal.color}30` }}
              >
                {getGoalEmoji(goal.icon)}
              </div>
              <div>
                <p className="font-bold text-sm text-[var(--text)]">{goal.name}</p>
                {goal.deadline && (
                  <p className="text-xs text-[var(--text-subtle)] flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    {formatDate(goal.deadline)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!isComplete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-petal-50 hover:text-petal-500"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-extrabold text-[var(--text)]">
                {formatCurrency(current)}
              </span>
              <span className="text-sm text-[var(--text-subtle)]">
                de {formatCurrency(target)}
              </span>
            </div>

            <Progress value={progress} color={goal.color} />

            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-subtle)]">
                {isComplete ? "🎉 ¡Meta alcanzada!" : `Faltan ${formatCurrency(remaining)}`}
              </span>
              <Badge
                variant={isComplete ? "income" : goal.status === "PAUSED" ? "soft" : "default"}
              >
                {isComplete ? "✓ Completada" : goal.status === "PAUSED" ? "Pausada" : `${Math.round(progress)}%`}
              </Badge>
            </div>
          </div>

          {!isComplete && progress >= 95 && (
            <Button
              variant="soft"
              size="sm"
              className="w-full mt-3 gap-1.5"
              onClick={handleComplete}
              loading={isPending}
            >
              <Check className="h-3.5 w-3.5" />
              Marcar como completada
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar meta</DialogTitle>
          <DialogClose onClose={() => setEditOpen(false)} />
        </DialogHeader>
        <SavingsGoalForm goal={goal} onSuccess={() => setEditOpen(false)} />
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogHeader>
          <DialogTitle>¿Eliminar meta?</DialogTitle>
          <DialogClose onClose={() => setDeleteOpen(false)} />
        </DialogHeader>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          Se eliminará permanentemente <strong>{goal.name}</strong>.
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
