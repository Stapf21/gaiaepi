import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityItem {
  type: string
  description: string
}

interface ActivityFeedProps {
  items: ActivityItem[]
}

const typeConfig: Record<string, { color: string; label: string }> = {
  transferencia_interna: { color: "bg-primary", label: "Transferencia" },
  manutencao: { color: "bg-warning", label: "Manutencao" },
  ajuste: { color: "bg-chart-2", label: "Ajuste" },
  entrada: { color: "bg-primary", label: "Entrada" },
  saida: { color: "bg-destructive", label: "Saida" },
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/20">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Ultimas movimentacoes
        </h3>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-5 flex flex-col gap-0">
        {items.map((item, i) => {
          const config = typeConfig[item.type] || { color: "bg-muted-foreground", label: item.type }
          return (
            <div
              key={i}
              className={cn(
                "group flex items-center gap-4 py-3",
                i !== items.length - 1 && "border-b border-border"
              )}
            >
              <span className={cn("h-2 w-2 shrink-0 rounded-full", config.color)} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">{item.description}</p>
              </div>
              <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {config.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
