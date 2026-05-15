"use client"

import { useState, useTransition } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Toast, useToast } from "@/components/ui/toast"
import { CategoryForm } from "@/components/categories/category-form"
import { deleteCategory } from "@/actions/categories"
import type { CategoryWithCount } from "@/types"

interface Props {
  category: CategoryWithCount
}

export function CategoryCard({ category }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast, show, hide } = useToast()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCategory(category.id)
      if (result.success) {
        show("Categoría eliminada", "success")
        setDeleteOpen(false)
      } else {
        show(result.error ?? "Error al eliminar", "error")
      }
    })
  }

  return (
    <>
      <Card className="group">
        <CardContent className="flex items-center gap-3 pt-4 pb-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
            style={{ background: category.color + "20", border: `2px solid ${category.color}40` }}
          >
            <span style={{ color: category.color }}>{category.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-[var(--text)]">{category.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={category.type === "INCOME" ? "income" : "expense"} className="text-xs py-0">
                {category.type === "INCOME" ? "Ingreso" : "Gasto"}
              </Badge>
              <span className="text-xs text-[var(--text-subtle)]">
                {category._count.transactions} movimientos
              </span>
            </div>
          </div>
          {!category.isDefault && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditOpen(true)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-petal-50 hover:text-petal-500"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          {category.isDefault && (
            <Badge variant="soft" className="text-xs">Predeterminada</Badge>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogHeader>
          <DialogTitle>Editar categoría</DialogTitle>
          <DialogClose onClose={() => setEditOpen(false)} />
        </DialogHeader>
        <CategoryForm category={category} onSuccess={() => setEditOpen(false)} />
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogHeader>
          <DialogTitle>¿Eliminar categoría?</DialogTitle>
          <DialogClose onClose={() => setDeleteOpen(false)} />
        </DialogHeader>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          Los movimientos asociados quedarán sin categoría.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete} loading={isPending}>Eliminar</Button>
        </div>
      </Dialog>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </>
  )
}
