import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AddCategoryButton() {
  return (
    <Link href="/categories/new">
      <Button size="sm" className="gap-1.5">
        <Plus className="h-4 w-4" />
        Nueva
      </Button>
    </Link>
  )
}
