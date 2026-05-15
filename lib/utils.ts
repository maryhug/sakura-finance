import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "ARS"): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string, fmt = "dd/MM/yyyy"): string {
  return format(new Date(date), fmt, { locale: es })
}

export function formatMonthYear(date: Date | string): string {
  return format(new Date(date), "MMMM yyyy", { locale: es })
}

export function getCurrentMonthRange() {
  const now = new Date()
  return { start: startOfMonth(now), end: endOfMonth(now) }
}

export function getMonthRange(offset = 0) {
  const d = new Date()
  d.setMonth(d.getMonth() + offset)
  return { start: startOfMonth(d), end: endOfMonth(d) }
}

export function toDecimal(value: unknown): number {
  if (typeof value === "number") return value
  if (typeof value === "string") return parseFloat(value)
  // Prisma Decimal objects have a toNumber or toString method
  if (value && typeof (value as { toNumber?: () => number }).toNumber === "function") {
    return (value as { toNumber: () => number }).toNumber()
  }
  return Number(value)
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export const CATEGORY_COLORS = [
  "#f472b6", "#ec4899", "#a855f7", "#8b5cf6", "#6366f1",
  "#3b82f6", "#06b6d4", "#14b8a6", "#22c55e", "#84cc16",
  "#eab308", "#f97316", "#ef4444", "#f43f5e", "#e879f9",
]

export const MONTH_NAMES_SHORT = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
]
