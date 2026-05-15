"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { Select } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Category } from "@prisma/client"

interface Props {
  categories: Category[]
}

export function TransactionFilters({ categories }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const type = searchParams.get("type") ?? ""
  const categoryId = searchParams.get("categoryId") ?? ""
  const month = searchParams.get("month") ?? ""

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v)
        else params.delete(k)
      })
      return params.toString()
    },
    [searchParams]
  )

  function update(key: string, value: string) {
    router.push(pathname + "?" + createQueryString({ [key]: value }))
  }

  function clearFilters() {
    router.push(pathname)
  }

  const hasFilters = type || categoryId || month

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <Select
        label="Tipo"
        value={type}
        onChange={(e) => update("type", e.target.value)}
        className="w-36"
      >
        <option value="">Todos</option>
        <option value="INCOME">Ingresos</option>
        <option value="EXPENSE">Gastos</option>
      </Select>

      <Select
        label="Categoría"
        value={categoryId}
        onChange={(e) => update("categoryId", e.target.value)}
        className="w-44"
      >
        <option value="">Todas</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </Select>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[var(--text-muted)]">Mes</label>
        <input
          type="month"
          value={month}
          onChange={(e) => update("month", e.target.value)}
          className="input-sakura w-40"
        />
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 self-end">
          <X className="h-3.5 w-3.5" />
          Limpiar
        </Button>
      )}
    </div>
  )
}
