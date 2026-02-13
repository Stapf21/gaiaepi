"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FileText,
  ArrowLeftRight,
  ClipboardCheck,
  UtensilsCrossed,
  Home,
  BarChart3,
  LogOut,
  Settings,
  Box,
} from "lucide-react"
import { cn } from "@/lib/utils"

const operationLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/estoque", label: "Meu Estoque", icon: Package },
  { href: "/solicitacoes", label: "Solicitacoes", icon: FileText },
  { href: "/movimentacoes", label: "Movimentacoes", icon: ArrowLeftRight },
  { href: "/inventario", label: "Inventario", icon: ClipboardCheck },
  { href: "/consumo", label: "Consumo", icon: UtensilsCrossed },
  { href: "/chales", label: "Chales", icon: Home },
  { href: "/relatorios", label: "Relatorios", icon: BarChart3 },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Box className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-primary">
            Hotelaria
          </p>
          <h1 className="text-sm font-semibold text-foreground">
            Gestao Estoque
          </h1>
        </div>
      </div>

      <div className="mx-5 h-px bg-border" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-widest text-sidebar-muted">
          Operacao
        </p>
        <ul className="flex flex-col gap-px">
          {operationLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <link.icon className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-primary" : "text-sidebar-muted"
                  )} />
                  {link.label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="my-4 mx-2 h-px bg-border" />

        <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-widest text-sidebar-muted">
          Admin
        </p>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
        >
          <Settings className="h-4 w-4 text-sidebar-muted" />
          Configuracoes
        </Link>
      </nav>

      {/* User Section */}
      <div className="border-t border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-foreground">
              admin@estoque.com
            </p>
            <p className="text-[11px] text-sidebar-muted">Administrador</p>
          </div>
          <button className="shrink-0 rounded-md p-1.5 text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-destructive">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
