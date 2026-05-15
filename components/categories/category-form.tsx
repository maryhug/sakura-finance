"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toast, useToast } from "@/components/ui/toast"
import { categorySchema, type CategoryInput } from "@/lib/validations"
import { createCategory, updateCategory } from "@/actions/categories"
import { CATEGORY_COLORS, cn } from "@/lib/utils"
import { CATEGORY_ICONS } from "@/lib/icons"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { Category } from "@prisma/client"

interface Props {
  category?: Category
  onSuccess?: () => void
  redirectOnSuccess?: string
}

export function CategoryForm({ category, onSuccess, redirectOnSuccess }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { toast, show, hide } = useToast()
  const [selectedIcon, setSelectedIcon] = useState(category?.icon ?? "tag")
  const [selectedColor, setSelectedColor] = useState(category?.color ?? "#f472b6")
  const [selectedType, setSelectedType] = useState<"INCOME" | "EXPENSE">((category?.type as "INCOME" | "EXPENSE") ?? "EXPENSE")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      icon: category?.icon ?? "tag",
      color: category?.color ?? "#f472b6",
      type: (category?.type as "INCOME" | "EXPENSE") ?? "EXPENSE",
    },
  })

  function onSubmit(data: CategoryInput) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => formData.append(k, v))

      const result = category
        ? await updateCategory(category.id, formData)
        : await createCategory(formData)

      if (result.success) {
        show(category ? "Categoría actualizada" : "Categoría creada", "success")
        setTimeout(() => {
          if (redirectOnSuccess) router.push(redirectOnSuccess)
          else onSuccess?.()
        }, 600)
      } else {
        show(result.error ?? "Error", "error")
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Nombre" placeholder="ej. Alimentación, Salario..." error={errors.name?.message} {...register("name")} />

        <div>
          <label className="text-sm font-semibold text-[var(--text-muted)] block mb-2">Tipo</label>
          <div className="flex gap-2 p-1 bg-[var(--surface-2)] rounded-2xl">
            {(["EXPENSE", "INCOME"] as const).map((t) => (
              <label
                key={t}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all",
                  selectedType === t
                    ? t === "INCOME"
                      ? "bg-mint-100 text-mint-700 shadow-sm ring-1 ring-mint-300"
                      : "bg-sakura-100 text-sakura-600 shadow-sm ring-1 ring-sakura-300"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                )}
              >
                <input
                  type="radio"
                  value={t}
                  {...register("type")}
                  className="sr-only"
                  onChange={() => { setSelectedType(t); setValue("type", t) }}
                />
                <span className="flex items-center gap-1">
                  {t === "INCOME"
                    ? <TrendingUp className="h-3.5 w-3.5" />
                    : <TrendingDown className="h-3.5 w-3.5" />}
                  {t === "INCOME" ? "Ingreso" : "Gasto"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Icon grid */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-muted)] mb-2">Ícono</p>
          <div className="grid grid-cols-8 gap-1.5">
            {CATEGORY_ICONS.map(({ id, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => { setSelectedIcon(id); setValue("icon", id) }}
                className={cn(
                  "w-9 h-9 rounded-xl transition-all flex items-center justify-center",
                  selectedIcon === id
                    ? "bg-sakura-100 border-2 border-sakura-400 text-sakura-600"
                    : "bg-[var(--surface-2)] hover:bg-sakura-50 border border-[var(--border)] text-[var(--text-muted)]"
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-muted)] mb-2">Color</p>
          <div className="flex flex-wrap gap-2 items-center">
            {CATEGORY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => { setSelectedColor(color); setValue("color", color) }}
                className={cn(
                  "w-7 h-7 rounded-full transition-all flex-shrink-0",
                  selectedColor === color && "ring-2 ring-offset-2 ring-[var(--primary)] scale-110"
                )}
                style={{ background: color }}
              />
            ))}

            {/* Custom color via native picker */}
            <label
              className={cn(
                "w-7 h-7 rounded-full flex-shrink-0 cursor-pointer transition-all overflow-hidden border-2 border-dashed border-[var(--border)] hover:border-sakura-400 relative",
                !CATEGORY_COLORS.includes(selectedColor) && "ring-2 ring-offset-2 ring-[var(--primary)] scale-110"
              )}
              title="Elegir color personalizado"
              style={{ background: !CATEGORY_COLORS.includes(selectedColor) ? selectedColor : "transparent" }}
            >
              {CATEGORY_COLORS.includes(selectedColor) && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-[var(--text-subtle)]">+</span>
              )}
              <input
                type="color"
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                value={selectedColor}
                onChange={(e) => { setSelectedColor(e.target.value); setValue("color", e.target.value) }}
              />
            </label>
          </div>
          <p className="text-xs text-[var(--text-subtle)] mt-1.5">
            Color actual: <span className="font-mono">{selectedColor}</span>
          </p>
        </div>

        <input type="hidden" {...register("icon")} value={selectedIcon} />
        <input type="hidden" {...register("color")} value={selectedColor} />

        <Button type="submit" className="w-full" loading={isPending}>
          {category ? "Guardar cambios" : "Crear categoría"}
        </Button>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </>
  )
}
