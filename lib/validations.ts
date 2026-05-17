import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
})

export const transactionSchema = z.object({
  description: z.string().min(1, "La descripción es requerida").max(100),
  amount: z
    .string()
    .min(1, "El monto es requerido")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "El monto debe ser mayor a 0",
    }),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().optional(),
  date: z.string().min(1, "La fecha es requerida"),
  notes: z.string().max(300).optional(),
  savingsGoalId: z.string().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(50),
  icon: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color inválido"),
  type: z.enum(["INCOME", "EXPENSE"]),
})

export const savingsGoalSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(80),
  targetAmount: z
    .string()
    .min(1, "El monto objetivo es requerido")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "El monto debe ser mayor a 0",
    }),
  currentAmount: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) >= 0), {
      message: "El monto guardado no puede ser negativo",
    }),
  deadline: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type TransactionInput = z.infer<typeof transactionSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type SavingsGoalInput = z.infer<typeof savingsGoalSchema>
