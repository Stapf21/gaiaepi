"use client"

import { useState } from "react"
import { Plus, Trash2, Send, Clock, CheckCircle2, XCircle, Truck } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SolicitacaoItem {
  id: number
  produto: string
  quantidade: string
}

const recentSolicitacoes = [
  { id: "#001", data: "10/02/2026", centro: "Cozinha", status: "aprovada", itens: 3 },
  { id: "#002", data: "08/02/2026", centro: "Camareiras", status: "pendente", itens: 2 },
  { id: "#003", data: "05/02/2026", centro: "Recepcao", status: "entregue", itens: 5 },
  { id: "#004", data: "03/02/2026", centro: "Manutencao", status: "rejeitada", itens: 1 },
]

const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  pendente: { icon: Clock, color: "text-warning", label: "Pendente" },
  aprovada: { icon: CheckCircle2, color: "text-primary", label: "Aprovada" },
  entregue: { icon: Truck, color: "text-chart-2", label: "Entregue" },
  rejeitada: { icon: XCircle, color: "text-destructive", label: "Rejeitada" },
}

export default function SolicitacoesPage() {
  const [items, setItems] = useState<SolicitacaoItem[]>([
    { id: 1, produto: "", quantidade: "" },
  ])

  const addItem = () => {
    setItems((prev) => [...prev, { id: Date.now(), produto: "", quantidade: "" }])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Solicitacoes
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          Gerenciar solicitacoes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fluxo formal: solicitar, aprovar, entregar e consumir no setor.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Form - takes 3 cols */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Nova solicitacao
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
                Centro solicitante *
              </label>
              <Select defaultValue="almoxarifado">
                <SelectTrigger className="bg-secondary border-border text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="almoxarifado">Almoxarifado</SelectItem>
                  <SelectItem value="cozinha">Cozinha</SelectItem>
                  <SelectItem value="recepcao">Recepcao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
                Centro de atendimento *
              </label>
              <Select>
                <SelectTrigger className="bg-secondary border-border text-sm">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="almoxarifado">Almoxarifado</SelectItem>
                  <SelectItem value="cozinha">Cozinha</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">
                Itens da solicitacao *
              </span>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                <Plus className="h-3 w-3" />
                Adicionar
              </button>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-end gap-3 rounded-xl bg-secondary/50 p-4"
                >
                  <div className="flex-1">
                    <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
                      {"Produto " + (index + 1)}
                    </label>
                    <Select>
                      <SelectTrigger className="bg-card border-border text-sm">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agua">Agua sem gas 500ml</SelectItem>
                        <SelectItem value="sabonete">Sabonete 20g</SelectItem>
                        <SelectItem value="papel">Papel Higienico</SelectItem>
                        <SelectItem value="toalha">Toalha de Banho</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-28">
                    <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
                      Qtd.
                    </label>
                    <Input type="number" placeholder="0" className="bg-card border-border text-sm" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="mb-0.5 shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remover</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Observation */}
          <div className="mt-5">
            <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
              Observacao
            </label>
            <Textarea
              placeholder="Notas adicionais..."
              className="min-h-20 resize-none bg-secondary border-border text-sm"
            />
          </div>

          {/* Submit */}
          <div className="mt-5">
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Send className="h-4 w-4" />
              Criar solicitacao
            </Button>
          </div>
        </div>

        {/* Recent - takes 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Recentes
          </h2>
          <div className="mt-5 flex flex-col gap-0">
            {recentSolicitacoes.map((sol, i) => {
              const config = statusConfig[sol.status] || statusConfig.pendente
              const StatusIcon = config.icon
              return (
                <div
                  key={sol.id}
                  className={cn(
                    "group flex items-center gap-4 py-4 transition-colors hover:bg-secondary/50 rounded-lg px-2 -mx-2",
                    i !== recentSolicitacoes.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <StatusIcon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {sol.id}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {sol.data}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {sol.centro} &middot; {sol.itens} {sol.itens === 1 ? "item" : "itens"}
                    </p>
                  </div>
                  <span className={cn("text-[11px] font-semibold", config.color)}>
                    {config.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
