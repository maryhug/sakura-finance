"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { categorySchema } from "@/lib/validations"
import type { ActionResult } from "@/types"
import type { Category } from "@prisma/client"

type TransactionType = "INCOME" | "EXPENSE"

export async function getCategories(type?: TransactionType): Promise<Category[]> {
  const user = await requireAuth()

  return prisma.category.findMany({
    where: {
      OR: [{ userId: user.id }, { isDefault: true, userId: null }],
      ...(type ? { type } : {}),
    },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  })
}

export async function createCategory(formData: FormData): Promise<ActionResult<Category>> {
  const user = await requireAuth()

  const raw = {
    name: formData.get("name") as string,
    icon: formData.get("icon") as string,
    color: formData.get("color") as string,
    type: formData.get("type") as string,
  }

  const parsed = categorySchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const category = await prisma.category.create({
    data: { ...parsed.data, type: parsed.data.type as TransactionType, userId: user.id },
  })

  revalidatePath("/categories")
  return { success: true, data: category }
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireAuth()

  const raw = {
    name: formData.get("name") as string,
    icon: formData.get("icon") as string,
    color: formData.get("color") as string,
    type: formData.get("type") as string,
  }

  const parsed = categorySchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const cat = await prisma.category.findFirst({ where: { id, userId: user.id } })
  if (!cat) return { success: false, error: "Categoría no encontrada" }

  await prisma.category.update({
    where: { id },
    data: { ...parsed.data, type: parsed.data.type as TransactionType },
  })

  revalidatePath("/categories")
  return { success: true }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const user = await requireAuth()

  const cat = await prisma.category.findFirst({ where: { id, userId: user.id } })
  if (!cat) return { success: false, error: "Categoría no encontrada o es predeterminada" }

  await prisma.category.delete({ where: { id } })

  revalidatePath("/categories")
  revalidatePath("/transactions")
  return { success: true }
}
