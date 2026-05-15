"use server"

import { signIn, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

export async function register(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" }
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: "Ya existe una cuenta con ese email" }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: { name, email, password: hashed },
  })

  return { success: true }
}

export async function login(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/dashboard",
    })
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Email o contraseña incorrectos" }
        default:
          return { error: "Error al iniciar sesión" }
      }
    }
    throw err
  }
}

export async function logout() {
  await signOut({ redirectTo: "/auth/signin" })
}
