"use client"

import { TrendingUp, ArrowDownCircle, Package } from "lucide-react"

import { KpiSparkline } from "@/components/dashboard/kpi-sparkline"
import { AlertPanel } from "@/components/dashboard/alert-panel"
import { ConsumptionAreaChart } from "@/components/dashboard/consumption-area-chart"
import { TopProductsBarChart } from "@/components/dashboard/top-products-bar-chart"
import { CentroDonutChart } from "@/components/dashboard/centro-donut-chart"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          Visão operacional
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumo dos últimos 30 dias de movimentações.
        </p>
      </div>

      {/* KPI Row with Sparklines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiSparkline
          title="Movimentações"
          value={23}
          description="no período"
          icon={TrendingUp}
          trend="+12%"
          trendUp={true}
          accentColor="text-primary"
          sparkColor="#4ade80"
          sparkData={[2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7, 9]}
        />

        <KpiSparkline
          title="Consumo total"
          value={119}
          description="baixadas"
          icon={ArrowDownCircle}
          trend="-5%"
          trendUp={false}
          accentColor="text-destructive"
          sparkColor="#f87171"
          sparkData={[12, 18, 15, 22, 19, 25, 20, 28, 24, 30, 26, 22]}
        />

        <KpiSparkline
          title="Itens em estoque"
          value={347}
          description="unidades"
          icon={Package}
          trend="+3%"
          trendUp={true}
          accentColor="text-chart-2"
          sparkColor="#60a5fa"
          sparkData={[320, 315, 330, 328, 340, 335, 345, 342, 350, 348, 347, 347]}
        />

        <div className="sm:col-span-2 lg:col-span-1">
          <AlertPanel
            alerts={[
              { message: "Lâmpada LED 12W: saldo 0 / mínimo 20", type: "warning" },
              { message: "Travesseiro: saldo 0 / mínimo 20", type: "warning" },
              { message: "Sem produtos vencidos.", type: "info" },
            ]}
          />
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ConsumptionAreaChart />
        </div>
        <CentroDonutChart />
      </div>

      {/* Bottom Row */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopProductsBarChart />
        <ActivityFeed
          items={[
            { type: "transferencia_interna", description: "Papel Higiênico - 15" },
            { type: "transferencia_interna", description: "Sabonete 20g - 20" },
            { type: "manutencao", description: "Travesseiro - 1" },
            { type: "ajuste", description: "Água sem gás 500ml - 10" },
            { type: "entrada", description: "Shampoo 30ml - 50" },
          ]}
        />
      </div>
    </div>
  )
}
