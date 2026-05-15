import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AddSavingsGoalButton() {
  return (
    <Link href="/savings/new">
      <Button size="sm" className="gap-1.5">
        <Plus className="h-4 w-4" />
        Nueva meta
      </Button>
    </Link>
  )
}
