"use client"

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { day: "01", consumo: 8, movimentacoes: 3 },
  { day: "05", consumo: 15, movimentacoes: 5 },
  { day: "08", consumo: 22, movimentacoes: 4 },
  { day: "10", consumo: 18, movimentacoes: 7 },
  { day: "12", consumo: 32, movimentacoes: 6 },
  { day: "15", consumo: 28, movimentacoes: 8 },
  { day: "18", consumo: 45, movimentacoes: 5 },
  { day: "20", consumo: 38, movimentacoes: 9 },
  { day: "22", consumo: 52, movimentacoes: 7 },
  { day: "25", consumo: 41, movimentacoes: 11 },
  { day: "28", consumo: 60, movimentacoes: 8 },
  { day: "30", consumo: 55, movimentacoes: 10 },
]

const GREEN = "#4ade80"
const BLUE = "#60a5fa"

export function ConsumptionAreaChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/20">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Consumo vs Movimentacoes
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Ultimos 30 dias
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GREEN }} />
            <span className="text-[11px] text-muted-foreground">Consumo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: BLUE }} />
            <span className="text-[11px] text-muted-foreground">Movimentacoes</span>
          </div>
        </div>
      </div>
      <ChartContainer
        config={{
          consumo: { label: "Consumo", color: GREEN },
          movimentacoes: { label: "Movimentacoes", color: BLUE },
        }}
        className="mt-4 h-[240px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientConsumo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GREEN} stopOpacity={0.3} />
                <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientMov" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BLUE} stopOpacity={0.2} />
                <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(0 0% 14%)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(0 0% 50%)", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(0 0% 50%)", fontSize: 11 }}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              type="monotone"
              dataKey="consumo"
              stroke={GREEN}
              strokeWidth={2}
              fill="url(#gradientConsumo)"
              dot={false}
              activeDot={{ r: 4, fill: GREEN, stroke: "hsl(0 0% 7%)", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="movimentacoes"
              stroke={BLUE}
              strokeWidth={2}
              fill="url(#gradientMov)"
              dot={false}
              activeDot={{ r: 4, fill: BLUE, stroke: "hsl(0 0% 7%)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
