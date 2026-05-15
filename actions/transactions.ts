"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { transactionSchema } from "@/lib/validations"
import { startOfMonth, endOfMonth, subMonths } from "date-fns"
import type { ActionResult, MonthlyData, CategorySpending, DashboardStats, TransactionType, TransactionWithCategory } from "@/types"

export async function createTransaction(formData: FormData): Promise<ActionResult> {
  const user = await requireAuth()

  const raw = {
    description: formData.get("description") as string,
    amount: formData.get("amount") as string,
    type: formData.get("type") as string,
    categoryId: (formData.get("categoryId") as string) || undefined,
    date: formData.get("date") as string,
    notes: (formData.get("notes") as string) || undefined,
  }

  const parsed = transactionSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const { description, amount, type, categoryId, date, notes } = parsed.data

  await prisma.transaction.create({
    data: {
      description,
      amount: parseFloat(amount),
      type: type as TransactionType,
      categoryId: categoryId || null,
      date: new Date(date),
      notes: notes || null,
      userId: user.id,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return { success: true }
}

export async function updateTransaction(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireAuth()

  const raw = {
    description: formData.get("description") as string,
    amount: formData.get("amount") as string,
    type: formData.get("type") as string,
    categoryId: (formData.get("categoryId") as string) || undefined,
    date: formData.get("date") as string,
    notes: (formData.get("notes") as string) || undefined,
  }

  const parsed = transactionSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const tx = await prisma.transaction.findFirst({ where: { id, userId: user.id } })
  if (!tx) return { success: false, error: "Movimiento no encontrado" }

  const { description, amount, type, categoryId, date, notes } = parsed.data

  await prisma.transaction.update({
    where: { id },
    data: {
      description,
      amount: parseFloat(amount),
      type: type as TransactionType,
      categoryId: categoryId || null,
      date: new Date(date),
      notes: notes || null,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return { success: true }
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  const user = await requireAuth()

  const tx = await prisma.transaction.findFirst({ where: { id, userId: user.id } })
  if (!tx) return { success: false, error: "Movimiento no encontrado" }

  await prisma.transaction.delete({ where: { id } })

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return { success: true }
}

export async function getTransactions(
  filters: { type?: TransactionType; categoryId?: string; from?: Date; to?: Date } = {}
): Promise<TransactionWithCategory[]> {
  const user = await requireAuth()

  const where: Record<string, unknown> = { userId: user.id }
  if (filters.type) where.type = filters.type
  if (filters.categoryId) where.categoryId = filters.categoryId
  if (filters.from || filters.to) {
    where.date = {
      ...(filters.from ? { gte: filters.from } : {}),
      ...(filters.to ? { lte: filters.to } : {}),
    }
  }

  return prisma.transaction.findMany({
    where,
    include: { category: true },
    orderBy: { date: "desc" },
  })
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const user = await requireAuth()
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const [allTransactions, monthTransactions] = await Promise.all([
    prisma.transaction.findMany({ where: { userId: user.id }, select: { amount: true, type: true } }),
    prisma.transaction.findMany({
      where: { userId: user.id, date: { gte: monthStart, lte: monthEnd } },
      select: { amount: true, type: true },
    }),
  ])

  const toNum = (v: unknown) => parseFloat(String(v))

  const totalBalance = allTransactions.reduce((acc, t) => {
    return t.type === "INCOME" ? acc + toNum(t.amount) : acc - toNum(t.amount)
  }, 0)

  const monthIncome = monthTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, t) => acc + toNum(t.amount), 0)

  const monthExpense = monthTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + toNum(t.amount), 0)

  const monthSavings = monthIncome - monthExpense
  const savingsRate = monthIncome > 0 ? Math.round((monthSavings / monthIncome) * 100) : 0

  return { totalBalance, monthIncome, monthExpense, monthSavings, savingsRate }
}

export async function getMonthlyData(months = 6): Promise<MonthlyData[]> {
  const user = await requireAuth()

  const result: MonthlyData[] = []

  for (let i = months - 1; i >= 0; i--) {
    const d = subMonths(new Date(), i)
    const start = startOfMonth(d)
    const end = endOfMonth(d)

    const txs = await prisma.transaction.findMany({
      where: { userId: user.id, date: { gte: start, lte: end } },
      select: { amount: true, type: true },
    })

    const toNum = (v: unknown) => parseFloat(String(v))
    const income = txs.filter((t) => t.type === "INCOME").reduce((a, t) => a + toNum(t.amount), 0)
    const expense = txs.filter((t) => t.type === "EXPENSE").reduce((a, t) => a + toNum(t.amount), 0)

    result.push({
      month: d.toLocaleString("es-AR", { month: "short" }),
      income,
      expense,
      savings: income - expense,
    })
  }

  return result
}

export async function getCategorySpending(): Promise<CategorySpending[]> {
  const user = await requireAuth()
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const txs = await prisma.transaction.findMany({
    where: { userId: user.id, type: "EXPENSE", date: { gte: monthStart, lte: monthEnd } },
    select: {
      amount: true,
      category: { select: { id: true, name: true, color: true, icon: true } },
    },
  })

  const toNum = (v: unknown) => parseFloat(String(v))
  const total = txs.reduce((a, t) => a + toNum(t.amount), 0)

  const map = new Map<string, { name: string; color: string; icon: string; total: number }>()

  for (const tx of txs) {
    const key = tx.category?.id ?? "uncategorized"
    const name = tx.category?.name ?? "Sin categoría"
    const color = tx.category?.color ?? "#e2e8f0"
    const icon = tx.category?.icon ?? "circle"
    const existing = map.get(key) ?? { name, color, icon, total: 0 }
    map.set(key, { ...existing, total: existing.total + toNum(tx.amount) })
  }

  return Array.from(map.entries())
    .map(([categoryId, data]) => ({
      categoryId,
      ...data,
      percentage: total > 0 ? Math.round((data.total / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total)
}
