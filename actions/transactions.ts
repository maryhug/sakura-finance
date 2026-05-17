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
    savingsGoalId: (formData.get("savingsGoalId") as string) || undefined,
  }

  const parsed = transactionSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const { description, amount, type, categoryId, date, notes, savingsGoalId } = parsed.data
  const numAmount = parseFloat(amount)

  await prisma.$transaction(async (tx) => {
    await tx.transaction.create({
      data: {
        description,
        amount: numAmount,
        type: type as TransactionType,
        categoryId: categoryId || null,
        date: new Date(date),
        notes: notes || null,
        userId: user.id,
        savingsGoalId: savingsGoalId || null,
      },
    })

    if (savingsGoalId) {
      const goal = await tx.savingsGoal.findFirst({ where: { id: savingsGoalId, userId: user.id } })
      if (goal) {
        await tx.savingsGoal.update({
          where: { id: savingsGoalId },
          data: { currentAmount: { increment: numAmount } },
        })
      }
    }
  })

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  revalidatePath("/savings")
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
    savingsGoalId: (formData.get("savingsGoalId") as string) || undefined,
  }

  const parsed = transactionSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const existing = await prisma.transaction.findFirst({ where: { id, userId: user.id } })
  if (!existing) return { success: false, error: "Movimiento no encontrado" }

  const { description, amount, type, categoryId, date, notes, savingsGoalId } = parsed.data
  const newAmount = parseFloat(amount)
  const oldAmount = parseFloat(String(existing.amount))
  const oldGoalId = existing.savingsGoalId
  const newGoalId = savingsGoalId || null

  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id },
      data: {
        description,
        amount: newAmount,
        type: type as TransactionType,
        categoryId: categoryId || null,
        date: new Date(date),
        notes: notes || null,
        savingsGoalId: newGoalId,
      },
    })

    // Reverse old contribution
    if (oldGoalId) {
      const oldGoal = await tx.savingsGoal.findUnique({ where: { id: oldGoalId } })
      if (oldGoal) {
        const adjusted = Math.max(0, parseFloat(String(oldGoal.currentAmount)) - oldAmount)
        await tx.savingsGoal.update({ where: { id: oldGoalId }, data: { currentAmount: adjusted } })
      }
    }

    // Apply new contribution
    if (newGoalId) {
      const newGoal = await tx.savingsGoal.findFirst({ where: { id: newGoalId, userId: user.id } })
      if (newGoal) {
        await tx.savingsGoal.update({
          where: { id: newGoalId },
          data: { currentAmount: { increment: newAmount } },
        })
      }
    }
  })

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  revalidatePath("/savings")
  return { success: true }
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  const user = await requireAuth()

  const existing = await prisma.transaction.findFirst({ where: { id, userId: user.id } })
  if (!existing) return { success: false, error: "Movimiento no encontrado" }

  await prisma.$transaction(async (tx) => {
    await tx.transaction.delete({ where: { id } })

    if (existing.savingsGoalId) {
      const goal = await tx.savingsGoal.findUnique({ where: { id: existing.savingsGoalId } })
      if (goal) {
        const adjusted = Math.max(0, parseFloat(String(goal.currentAmount)) - parseFloat(String(existing.amount)))
        await tx.savingsGoal.update({ where: { id: existing.savingsGoalId }, data: { currentAmount: adjusted } })
      }
    }
  })

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  revalidatePath("/savings")
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

  const toNum = (v: unknown) => parseFloat(String(v))

  const rows = await prisma.transaction.findMany({
    where,
    include: { category: true, savingsGoal: true },
    orderBy: { date: "desc" },
  })

  return rows.map((tx) => ({
    ...tx,
    amount: toNum(tx.amount),
    savingsGoal: tx.savingsGoal
      ? {
          ...tx.savingsGoal,
          targetAmount: toNum(tx.savingsGoal.targetAmount),
          currentAmount: toNum(tx.savingsGoal.currentAmount),
        }
      : null,
  }))
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
