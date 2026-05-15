import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { SavingsGoalForm } from "@/components/savings/savings-goal-form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Nueva meta de ahorro" }

export default function NewSavingsGoalPage() {
  return (
    <div className="space-y-5 animate-fade-in max-w-lg mx-auto">
      <PageHeader
        title="Nueva meta de ahorro"
        subtitle="Definí tu objetivo y empezá a ahorrar"
        action={
          <Link href="/savings">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        }
      />
      <Card>
        <CardContent className="pt-5">
          <SavingsGoalForm redirectOnSuccess="/savings" />
        </CardContent>
      </Card>
    </div>
  )
}
