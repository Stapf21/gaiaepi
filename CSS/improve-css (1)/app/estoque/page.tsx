"use client"

import { useState } from "react"
import { Package, SlidersHorizontal } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const stockItems = [
  { id: 1, produto: "Agua sem gas 500ml", categoria: "Bebidas", centro: "Almoxarifado", saldo: 120, minimo: 50, status: "ok" },
  { id: 2, produto: "Sabonete 20g", categoria: "Higiene", centro: "Almoxarifado", saldo: 45, minimo: 30, status: "ok" },
  { id: 3, produto: "Papel Higienico", categoria: "Higiene", centro: "Almoxarifado", saldo: 18, minimo: 20, status: "baixo" },
  { id: 4, produto: "Lampada LED 12W", categoria: "Manutencao", centro: "Almoxarifado", saldo: 0, minimo: 20, status: "critico" },
  { id: 5, produto: "Travesseiro", categoria: "Enxoval", centro: "Almoxarifado", saldo: 0, minimo: 20, status: "critico" },
  { id: 6, produto: "Toalha de Banho", categoria: "Enxoval", centro: "Almoxarifado", saldo: 35, minimo: 15, status: "ok" },
]

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ok: "bg-primary",
    baixo: "bg-warning",
    critico: "bg-destructive",
  }
  const labels: Record<string, string> = {
    ok: "Normal",
    baixo: "Baixo",
    critico: "Critico",
  }
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", colors[status])} />
      <span className="text-xs text-muted-foreground">{labels[status]}</span>
    </div>
  )
}

export default function EstoquePage() {
  const [centro, setCentro] = useState("almoxarifado")
  const [categoria, setCategoria] = useState("todas")

  const totalConsolidado = stockItems.reduce((acc, item) => acc + item.saldo, 0)

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Estoque
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          Meu estoque por centro
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Saldo calculado a partir das movimentacoes (fonte da verdade).
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Filtros
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
              Centro
            </label>
            <Select value={centro} onValueChange={setCentro}>
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
              Categoria
            </label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="bg-secondary border-border text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="bebidas">Bebidas</SelectItem>
                <SelectItem value="higiene">Higiene</SelectItem>
                <SelectItem value="enxoval">Enxoval</SelectItem>
                <SelectItem value="manutencao">Manutencao</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
              Produto
            </label>
            <Select defaultValue="todos">
              <SelectTrigger className="bg-secondary border-border text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stock Summary + Table */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Summary card */}
        <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Total consolidado
          </p>
          <p className="mt-2 font-mono text-4xl font-bold tracking-tighter text-foreground">
            {totalConsolidado}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            unidades em estoque
          </p>
        </div>

        {/* Table */}
        <div className="md:col-span-3 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Itens em estoque
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Produto</TableHead>
                <TableHead className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Categoria</TableHead>
                <TableHead className="text-right text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Saldo</TableHead>
                <TableHead className="text-right text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Min.</TableHead>
                <TableHead className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockItems.map((item) => (
                <TableRow key={item.id} className="border-border">
                  <TableCell className="text-sm font-medium text-foreground">{item.produto}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.categoria}</TableCell>
                  <TableCell className={cn(
                    "text-right font-mono text-sm font-semibold tabular-nums",
                    item.status === "critico" ? "text-destructive" : item.status === "baixo" ? "text-warning" : "text-foreground"
                  )}>
                    {item.saldo}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm tabular-nums text-muted-foreground">{item.minimo}</TableCell>
                  <TableCell>
                    <StatusDot status={item.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
