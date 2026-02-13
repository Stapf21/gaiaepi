"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

type KpiSparklineProps = {
  title: string
  value: number | string
  description?: string

  /** Passe o componente do ícone: ex. TrendingUp */
  icon?: React.ElementType

  trend?: string
  trendUp?: boolean

  accentColor?: string
  sparkColor?: string
  sparkData?: number[]
}

export function KpiSparkline({
  title,
  value,
  description,
  icon,
  trend,
  trendUp = true,
  accentColor = "text-primary",
  sparkColor = "#4ade80",
  sparkData = [],
}: KpiSparklineProps) {
  // Fallback caso icon venha undefined
  const Icon = (icon ?? TrendingUp) as React.ElementType

  // Sparkline simples em SVG (sem libs)
  const w = 120
  const h = 32
  const pad = 2

  const data = sparkData.length ? sparkData : [1, 2, 3, 2, 4, 3, 5]
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data
    .map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / (data.length - 1 || 1)
      const y = h - pad - ((v - min) * (h - pad * 2)) / range
      return `${x},${y}`
    })
    .join(" ")

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </div>
            {description ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>

          <div className="mt-0.5 rounded-md bg-muted/40 p-2">
            <Icon className={cn("h-4 w-4", accentColor)} />
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between gap-4">
          <div className="flex items-center gap-2">
            {trend ? (
              <span
                className={cn(
                  "text-xs font-semibold",
                  trendUp ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {trend}
              </span>
            ) : null}
          </div>

          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
            <polyline
              fill="none"
              stroke={sparkColor}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={points}
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
