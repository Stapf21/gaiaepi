"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { name: "Agua 500ml", value: 55 },
  { name: "Sabonete 20g", value: 38 },
  { name: "Papel Hig.", value: 26 },
  { name: "Toalha Banho", value: 18 },
  { name: "Shampoo", value: 14 },
]

const GREEN = "#4ade80"

export function TopProductsBarChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/20">
      <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Top produtos consumidos
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Ranking por quantidade
      </p>
      <ChartContainer
        config={{
          value: { label: "Quantidade", color: GREEN },
        }}
        className="mt-4 h-[240px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(0 0% 50%)", fontSize: 11 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(0 0% 70%)", fontSize: 11 }}
              width={85}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideIndicator />}
              cursor={{ fill: "hsl(0 0% 14% / 0.5)" }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={GREEN}
                  fillOpacity={1 - index * 0.15}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
