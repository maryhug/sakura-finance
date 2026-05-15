import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import * as dotenv from "dotenv"

dotenv.config()
dotenv.config({ path: ".env.local", override: true })

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: "Alimentación", icon: "utensils", color: "#f472b6" },
  { name: "Supermercado", icon: "shopping-cart", color: "#ec4899" },
  { name: "Vivienda / Alquiler", icon: "home", color: "#a855f7" },
  { name: "Transporte", icon: "bus", color: "#6366f1" },
  { name: "Salud", icon: "pill", color: "#22c55e" },
  { name: "Entretenimiento", icon: "clapperboard", color: "#f97316" },
  { name: "Ropa y belleza", icon: "shirt", color: "#e879f9" },
  { name: "Educación", icon: "book", color: "#3b82f6" },
  { name: "Tecnología", icon: "smartphone", color: "#06b6d4" },
  { name: "Mascotas", icon: "paw", color: "#84cc16" },
  { name: "Servicios (luz, gas, etc.)", icon: "wrench", color: "#eab308" },
  { name: "Suscripciones", icon: "monitor", color: "#8b5cf6" },
  { name: "Viajes", icon: "plane", color: "#0ea5e9" },
  { name: "Cafeterías / Restaurantes", icon: "coffee", color: "#f59e0b" },
  { name: "Regalos", icon: "gift", color: "#f43f5e" },
  { name: "Otros gastos", icon: "tag", color: "#94a3b8" },
]

const DEFAULT_INCOME_CATEGORIES = [
  { name: "Salario", icon: "briefcase", color: "#22c55e" },
  { name: "Freelance", icon: "laptop", color: "#4ade80" },
  { name: "Inversiones", icon: "trending-up", color: "#10b981" },
  { name: "Ventas", icon: "shopping-bag", color: "#34d399" },
  { name: "Bonos / Aguinaldo", icon: "party-popper", color: "#6ee7b7" },
  { name: "Alquileres cobrados", icon: "building", color: "#a7f3d0" },
  { name: "Otros ingresos", icon: "wallet", color: "#86efac" },
]

async function main() {
  console.log("Iniciando seed de Sakura Finance...")

  // Clear existing default categories
  await prisma.category.deleteMany({ where: { isDefault: true, userId: null } })

  // Create default expense categories
  for (const cat of DEFAULT_EXPENSE_CATEGORIES) {
    await prisma.category.create({
      data: { ...cat, type: "EXPENSE", isDefault: true },
    })
  }
  console.log(`✅ ${DEFAULT_EXPENSE_CATEGORIES.length} categorías de gasto creadas`)

  // Create default income categories
  for (const cat of DEFAULT_INCOME_CATEGORIES) {
    await prisma.category.create({
      data: { ...cat, type: "INCOME", isDefault: true },
    })
  }
  console.log(`✅ ${DEFAULT_INCOME_CATEGORIES.length} categorías de ingreso creadas`)

  console.log("Seed completado!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
