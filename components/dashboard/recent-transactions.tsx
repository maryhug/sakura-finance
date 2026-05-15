import Link from "next/link"
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { formatCurrency, formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { TransactionWithCategory } from "@/types"

export function RecentTransactions({ transactions }: { transactions: TransactionWithCategory[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Movimientos recientes</CardTitle>
          <Link href="/transactions">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              Ver todos <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {transactions.length === 0 ? (
          <EmptyState
            icon="💸"
            title="Sin movimientos aún"
            description="Registra tu primer ingreso o gasto."
            action={
              <Link href="/transactions/new">
                <Button size="sm">+ Nuevo movimiento</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors group"
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                    tx.type === "INCOME" ? "bg-mint-100 text-mint-600" : "bg-petal-100 text-petal-500"
                  )}
                >
                  {tx.type === "INCOME" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)] truncate">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[var(--text-subtle)]">{formatDate(tx.date)}</span>
                    {tx.category && (
                      <Badge
                        variant="soft"
                        className="text-xs py-0"
                        style={{ borderColor: tx.category.color + "40", color: tx.category.color }}
                      >
                        {tx.category.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm font-extrabold shrink-0",
                    tx.type === "INCOME" ? "text-[var(--income)]" : "text-[var(--expense)]"
                  )}
                >
                  {tx.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(parseFloat(String(tx.amount)))}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
