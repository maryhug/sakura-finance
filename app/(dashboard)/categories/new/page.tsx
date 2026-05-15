import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { CategoryForm } from "@/components/categories/category-form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Nueva categoría" }

export default function NewCategoryPage() {
  return (
    <div className="space-y-5 animate-fade-in max-w-lg mx-auto">
      <PageHeader
        title="Nueva categoría"
        subtitle="Organizá tus movimientos"
        action={
          <Link href="/categories">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        }
      />
      <Card>
        <CardContent className="pt-5">
          <CategoryForm redirectOnSuccess="/categories" />
        </CardContent>
      </Card>
    </div>
  )
}
