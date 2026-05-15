import type { Transaction, Category, TransactionType, GoalStatus } from "@prisma/client"

export type { TransactionType, GoalStatus }

export type TransactionWithCategory = Transaction & {
  category: Category | null
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
