import { AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertItem {
  message: string
  type: "warning" | "info"
}

interface AlertPanelProps {
  alerts: AlertItem[]
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const warningCount = alerts.filter((a) => a.type === "warning").length

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-warning/20 bg-card p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(38_92%_55%_/_0.06),_transparent_70%)]" />
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="text-xs font-medium uppercase tracking-widest text-warning">
            Alertas
          </h3>
          {warningCount > 0 && (
            <span className="ml-auto rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-warning">
              {warningCount}
            </span>
          )}
        </div>
        <ul className="mt-4 flex flex-1 flex-col gap-3">
          {alerts.map((alert, i) => (
            <li key={i} className="flex items-start gap-2.5">
              {alert.type === "warning" ? (
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-warning" />
              ) : (
                <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-xs leading-relaxed",
                  alert.type === "warning"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {alert.message}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
