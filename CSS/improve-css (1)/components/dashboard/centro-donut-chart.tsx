"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { name: "Camareiras", value: 64 },
  { name: "Cozinha", value: 55 },
  { name: "Recepcao", value: 12 },
  { name: "Manutencao", value: 8 },
]

const COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f87171"]
const total = data.reduce((sum, d) => sum + d.value, 0)

export function CentroDonutChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/20">
      <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Consumo por centro
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Distribuicao percentual
      </p>
      <ChartContainer
        config={{
          camareiras: { label: "Camareiras", color: COLORS[0] },
          cozinha: { label: "Cozinha", color: COLORS[1] },
          recepcao: { label: "Recepcao", color: COLORS[2] },
          manutencao: { label: "Manutencao", color: COLORS[3] },
        }}
        className="mx-auto mt-4 h-[200px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideIndicator={false}
                  indicator="dot"
                  formatter={(value, name) => (
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">{name}</span>
                      <span className="font-mono font-semibold text-foreground tabular-nums">
                        {value}
                      </span>
                    </span>
                  )}
                />
              }
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      {/* Legend */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: COLORS[i] }}
            />
            <div className="flex flex-1 items-center justify-between">
              <span className="text-xs text-muted-foreground">{item.name}</span>
              <span className="font-mono text-xs font-medium tabular-nums text-foreground">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
