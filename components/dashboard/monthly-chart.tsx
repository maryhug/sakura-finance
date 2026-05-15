"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { EmptyState } from "@/components/ui/empty-state"
import type { MonthlyData } from "@/types"

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="card-sakura px-3 py-2.5 text-sm space-y-1">
      <p className="font-bold text-[var(--text)] capitalize">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[var(--text-muted)] capitalize">{p.name}:</span>
          <span className="font-semibold text-[var(--text)]">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function MonthlyChart({ data }: { data: MonthlyData[] }) {
  const hasData = data.some((d) => d.income > 0 || d.expense > 0)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Evolución mensual</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <EmptyState icon="📊" title="Sin datos aún" description="Registra movimientos para ver tu evolución." />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "var(--text-subtle)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-subtle)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(v) => (
                  <span className="text-xs font-semibold text-[var(--text-muted)] capitalize">{v}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="ingresos"
                stroke="#4ade80"
                strokeWidth={2}
                fill="url(#incomeGrad)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="gastos"
                stroke="#f472b6"
                strokeWidth={2}
                fill="url(#expenseGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
