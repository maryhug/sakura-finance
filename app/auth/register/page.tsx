"use client"

import { useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, Sparkles } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toast, useToast } from "@/components/ui/toast"
import { registerSchema, type RegisterInput } from "@/lib/validations"
import { register as registerAction } from "@/actions/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { toast, show, hide } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  function onSubmit(data: RegisterInput) {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("password", data.password)

      const result = await registerAction(formData)
      if (result?.error) {
        show(result.error, "error")
      } else {
        show("¡Cuenta creada! Iniciando sesión... ✿", "success")
        setTimeout(() => router.push("/auth/signin"), 1000)
      }
    })
  }

  return (
    <div className="card-sakura p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-3xl bg-gradient-to-br from-sakura-300 to-sakura-500 flex items-center justify-center shadow-[0_4px_20px_rgba(244,114,182,0.4)]">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">Crear cuenta</h1>
        <p className="text-sm text-[var(--text-subtle)]">Empieza a controlar tus finanzas ✿</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Nombre" placeholder="Tu nombre" error={errors.name?.message} leftIcon={<User className="h-4 w-4" />} {...register("name")} />
        <Input label="Email" type="email" placeholder="hola@ejemplo.com" error={errors.email?.message} leftIcon={<Mail className="h-4 w-4" />} {...register("email")} />
        <Input label="Contraseña" type="password" placeholder="Mínimo 6 caracteres" error={errors.password?.message} leftIcon={<Lock className="h-4 w-4" />} {...register("password")} />
        <Button type="submit" className="w-full mt-2" loading={isPending}>
          Crear cuenta
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--text-muted)]">
        ¿Ya tenés cuenta?{" "}
        <Link href="/auth/signin" className="font-bold text-[var(--primary)] hover:text-sakura-600 transition-colors">
          Iniciá sesión
        </Link>
      </p>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
