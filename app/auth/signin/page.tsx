"use client"

import { useTransition } from "react"
import Link from "next/link"
import { Mail, Lock, Sparkles } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toast, useToast } from "@/components/ui/toast"
import { loginSchema, type LoginInput } from "@/lib/validations"
import { login } from "@/actions/auth"

export default function SignInPage() {
  const [isPending, startTransition] = useTransition()
  const { toast, show, hide } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  function onSubmit(data: LoginInput) {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("password", data.password)
      const result = await login(formData)
      if (result?.error) show(result.error, "error")
    })
  }

  return (
    <div className="card-sakura p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-3xl bg-gradient-to-br from-sakura-300 to-sakura-500 flex items-center justify-center shadow-[0_4px_20px_rgba(244,114,182,0.4)]">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">Sakura Finance</h1>
        <p className="text-sm text-[var(--text-subtle)]">Inicia sesión para ver tus finanzas</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="hola@ejemplo.com" error={errors.email?.message} leftIcon={<Mail className="h-4 w-4" />} {...register("email")} />
        <Input label="Contraseña" type="password" placeholder="••••••••" error={errors.password?.message} leftIcon={<Lock className="h-4 w-4" />} {...register("password")} />
        <Button type="submit" className="w-full mt-2" loading={isPending}>
          Iniciar sesión
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--text-muted)]">
        ¿No tenés cuenta?{" "}
        <Link href="/auth/register" className="font-bold text-[var(--primary)] hover:text-sakura-600 transition-colors">
          Registrate
        </Link>
      </p>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
