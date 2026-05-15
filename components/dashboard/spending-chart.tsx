"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { EmptyState } from "@/components/ui/empty-state"
import type { CategorySpending } from "@/types"

interface Props {
  data: CategorySpending[]
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: CategorySpending; value: number }> }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="card-sakura px-3 py-2 text-sm">
      <p className="font-bold text-[var(--text)]">{item.payload.name}</p>
      <p className="text-[var(--text-muted)]">{formatCurrency(item.value)}</p>
      <p className="text-[var(--text-subtle)]">{item.payload.percentage}% del total</p>
    </div>
  )
}

export function SpendingChart({ data }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Gastos por categoría</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState icon="🍰" title="Sin gastos este mes" description="Registra un gasto para ver el desglose." />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="total"
                  nameKey="name"
                >
                  {data.map((entry) => (
                    <Cell key={entry.categoryId} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {data.slice(0, 5).map((item) => (
                <div key={item.categoryId} className="flex items-center gap-2.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="text-sm text-[var(--text)] flex-1 truncate">{item.name}</span>
                  <span className="text-sm font-semibold text-[var(--text-muted)]">
                    {formatCurrency(item.total)}
                  </span>
                  <span className="text-xs text-[var(--text-subtle)] w-9 text-right">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
