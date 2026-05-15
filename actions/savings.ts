"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { savingsGoalSchema } from "@/lib/validations"
import type { ActionResult } from "@/types"
import type { SavingsGoal } from "@prisma/client"

export async function getSavingsGoals(): Promise<SavingsGoal[]> {
  const user = await requireAuth()
  return prisma.savingsGoal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })
}

export async function createSavingsGoal(formData: FormData): Promise<ActionResult<SavingsGoal>> {
  const user = await requireAuth()

  const raw = {
    name: formData.get("name") as string,
    targetAmount: formData.get("targetAmount") as string,
    currentAmount: (formData.get("currentAmount") as string) || "0",
    deadline: (formData.get("deadline") as string) || undefined,
    icon: (formData.get("icon") as string) || "piggy-bank",
    color: (formData.get("color") as string) || "#f472b6",
  }

  const parsed = savingsGoalSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const { name, targetAmount, currentAmount, deadline, icon, color } = parsed.data

  const goal = await prisma.savingsGoal.create({
    data: {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || "0"),
      deadline: deadline ? new Date(deadline) : null,
      icon: icon ?? "piggy-bank",
      color: color ?? "#f472b6",
      userId: user.id,
    },
  })

  revalidatePath("/savings")
  return { success: true, data: goal }
}

export async function updateSavingsGoal(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireAuth()

  const goal = await prisma.savingsGoal.findFirst({ where: { id, userId: user.id } })
  if (!goal) return { success: false, error: "Meta no encontrada" }

  const raw = {
    name: formData.get("name") as string,
    targetAmount: formData.get("targetAmount") as string,
    currentAmount: (formData.get("currentAmount") as string) || "0",
    deadline: (formData.get("deadline") as string) || undefined,
    icon: (formData.get("icon") as string) || "piggy-bank",
    color: (formData.get("color") as string) || "#f472b6",
  }

  const parsed = savingsGoalSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const { name, targetAmount, currentAmount, deadline, icon, color } = parsed.data

  await prisma.savingsGoal.update({
    where: { id },
    data: {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || "0"),
      deadline: deadline ? new Date(deadline) : null,
      icon: icon ?? "piggy-bank",
      color: color ?? "#f472b6",
    },
  })

  revalidatePath("/savings")
  return { success: true }
}

export async function deleteSavingsGoal(id: string): Promise<ActionResult> {
  const user = await requireAuth()

  const goal = await prisma.savingsGoal.findFirst({ where: { id, userId: user.id } })
  if (!goal) return { success: false, error: "Meta no encontrada" }

  await prisma.savingsGoal.delete({ where: { id } })

  revalidatePath("/savings")
  return { success: true }
}

export async function markGoalCompleted(id: string): Promise<ActionResult> {
  const user = await requireAuth()

  const goal = await prisma.savingsGoal.findFirst({ where: { id, userId: user.id } })
  if (!goal) return { success: false, error: "Meta no encontrada" }

  await prisma.savingsGoal.update({
    where: { id },
    data: { status: "COMPLETED" },
  })

  revalidatePath("/savings")
  return { success: true }
}
