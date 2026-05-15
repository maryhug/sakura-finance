import type { Metadata } from "next"
import { TrendingDown, TrendingUp, Tag } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { CategoryCard } from "@/components/categories/category-card"
import { EmptyState } from "@/components/ui/empty-state"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { AddCategoryButton } from "@/components/categories/add-category-button"

export const metadata: Metadata = { title: "Categorías" }

export default async function CategoriesPage() {
  const user = await requireAuth()

  const categories = await prisma.category.findMany({
    where: { OR: [{ userId: user.id }, { isDefault: true, userId: null }] },
    include: { _count: { select: { transactions: true } } },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  })

  const income = categories.filter((c) => c.type === "INCOME")
  const expense = categories.filter((c) => c.type === "EXPENSE")

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Categorías"
        subtitle={`${categories.length} categorías en total`}
        action={<AddCategoryButton />}
      />

      {/* Expense categories */}
      <div>
        <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wide mb-3 flex items-center gap-2">
          <TrendingDown className="h-3.5 w-3.5 text-petal-400" />
          Gastos
          <span className="font-normal text-[var(--text-subtle)]">({expense.length})</span>
        </h2>
        {expense.length === 0 ? (
          <EmptyState icon={<Tag className="h-10 w-10" />} title="Sin categorías de gasto" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {expense.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </div>

      {/* Income categories */}
      <div>
        <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wide mb-3 flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-mint-500" />
          Ingresos
          <span className="font-normal text-[var(--text-subtle)]">({income.length})</span>
        </h2>
        {income.length === 0 ? (
          <EmptyState icon={<Tag className="h-10 w-10" />} title="Sin categorías de ingreso" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {income.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
