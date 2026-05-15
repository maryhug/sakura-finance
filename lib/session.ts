import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/signin")
  return session.user as { id: string; email: string; name?: string | null; image?: string | null }
}
