"use client"

import { Search, Bell, ShieldAlert } from "lucide-react"
import { Input } from "@/components/ui/input"

export function TopHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-foreground">
          Sistema operacional de estoque
        </h2>
        <div className="flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1">
          <ShieldAlert className="h-3 w-3 text-destructive" />
          <span className="text-[11px] font-medium text-destructive">
            Gate bloqueada
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="h-8 w-52 rounded-lg border-border bg-secondary pl-9 text-xs placeholder:text-muted-foreground focus-visible:ring-primary"
          />
        </div>
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
          <span className="sr-only">Notificacoes</span>
        </button>
      </div>
    </header>
  )
}
