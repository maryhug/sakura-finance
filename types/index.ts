import type { Transaction, Category, SavingsGoal } from "@prisma/client"

export type TransactionType = "INCOME" | "EXPENSE"
export type GoalStatus = "ACTIVE" | "COMPLETED" | "PAUSED"

// SavingsGoal con Decimals serializados a number (para pasar a Client Components)
export type SerializedSavingsGoal = Omit<SavingsGoal, "targetAmount" | "currentAmount"> & {
  targetAmount: number
  currentAmount: number
}

// Tipo mínimo para el selector de metas en formularios
export type GoalOption = { id: string; name: string; status: GoalStatus }

export type TransactionWithCategory = Omit<Transaction, "amount"> & {
  amount: number
  category: Category | null
  savingsGoal: SerializedSavingsGoal | null
}

export type CategoryWithCount = Category & {
  _count: { transactions: number }
}

export interface DashboardStats {
  totalBalance: number
  monthIncome: number
  monthExpense: number
  monthSavings: number
  savingsRate: number
}

export interface MonthlyData {
  month: string
  income: number
  expense: number
  savings: number
}

export interface CategorySpending {
  categoryId: string
  name: string
  color: string
  icon: string
  total: number
  percentage: number
}

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export type Period = "current" | "last" | "3months" | "6months" | "year"
