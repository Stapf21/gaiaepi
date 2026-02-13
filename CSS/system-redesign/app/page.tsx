'use client'

import { useState } from 'react'
import { Bell, Search, Users, Package, AlertTriangle, CheckCircle2, Building2, Briefcase, Menu, X, Home, UserCircle, ArrowLeftRight, Settings, ClipboardList, AlertCircle, HardHat, ChevronRight, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Progress } from '@/components/ui/progress'

const funcionarios = [
  { id: 1, nome: 'Amanda Guimarães Mariano', empresa: 'Pousada Gaia Viva', departamento: 'Camareiras', cargo: 'Camareira Júnior 2', status: 'ATIVO', admissao: '04/12/2020' },
  { id: 2, nome: 'Anairam Fernanda Simão Vieira', empresa: 'Pousada Gaia Viva', departamento: 'Atendimento', cargo: 'Líder de atendimento', status: 'ATIVO', admissao: '01/08/2019' },
  { id: 3, nome: 'Arthur Henrique Oliveira Castro', empresa: 'Pousada Gaia Viva', departamento: 'Pet Care', cargo: 'Auxiliar de Banho e Tosa Júnior 2', status: 'ATIVO', admissao: '25/04/2024' },
  { id: 4, nome: 'Beatriz Rafaela Rocha Gomes da Silva', empresa: 'Pousada Gaia Viva', departamento: 'Camareiras', cargo: 'Líder de Governança', status: 'ATIVO', admissao: '02/05/2018' },
  { id: 5, nome: 'Caio Leonardo Rodrigues de Lima', empresa: 'Empório Gaia Viva', departamento: 'Restaurante', cargo: 'Garçom Júnior 2', status: 'ATIVO', admissao: '02/12/2025' },
]

const estoqueData = [
  { mes: 'Jan', quantidade: 245, valor: 12500 },
  { mes: 'Fev', quantidade: 228, valor: 11800 },
  { mes: 'Mar', quantidade: 267, valor: 13900 },
  { mes: 'Abr', quantidade: 198, valor: 10200 },
  { mes: 'Mai', quantidade: 312, valor: 15800 },
  { mes: 'Jun', quantidade: 289, valor: 14600 },
]

const distribuicaoDepartamentos = [
  { departamento: 'Camareiras', funcionarios: 8, percentual: 27.5 },
  { departamento: 'Atendimento', funcionarios: 6, percentual: 20.7 },
  { departamento: 'Restaurante', funcionarios: 5, percentual: 17.2 },
  { departamento: 'Pet Care', funcionarios: 4, percentual: 13.8 },
  { departamento: 'Administração', funcionarios: 3, percentual: 10.3 },
  { departamento: 'Outros', funcionarios: 3, percentual: 10.3 },
]

const episPorTipo = [
  { tipo: 'Capacete Segurança', quantidade: 45, cor: 'hsl(var(--chart-1))' },
  { tipo: 'Luvas Proteção', quantidade: 78, cor: 'hsl(var(--chart-2))' },
  { tipo: 'Botas', quantidade: 32, cor: 'hsl(var(--chart-3))' },
  { tipo: 'Óculos', quantidade: 56, cor: 'hsl(var(--chart-4))' },
  { tipo: 'Outros', quantidade: 24, cor: 'hsl(var(--chart-5))' },
]

const entregasRecentes = [
  { data: '10/02', entregas: 12 },
  { data: '11/02', entregas: 8 },
  { data: '12/02', entregas: 15 },
  { data: '13/02', entregas: 6 },
  { data: '14/02', entregas: 11 },
  { data: '15/02', entregas: 9 },
  { data: '16/02', entregas: 14 },
]

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground animate-float">
              <HardHat className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Sistema Gaia</h1>
              <p className="text-xs text-muted-foreground">Gestão Integrada</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <div className="mb-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Operacional</p>
              <Button variant="default" className="w-full justify-start gap-3 shadow-sm btn-hover-lift">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 hover:translate-x-1 transition-transform">
                <Users className="h-4 w-4" />
                Funcionários
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 hover:translate-x-1 transition-transform">
                <ArrowLeftRight className="h-4 w-4" />
                Entradas & Saídas
              </Button>
            </div>

            <div className="mb-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Administrativo</p>
              <Button variant="ghost" className="w-full justify-start gap-3 hover:translate-x-1 transition-transform">
                <Building2 className="h-4 w-4" />
                Empresas
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 hover:translate-x-1 transition-transform">
                <Briefcase className="h-4 w-4" />
                Departamentos
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 hover:translate-x-1 transition-transform">
                <UserCircle className="h-4 w-4" />
                Cargos
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 hover:translate-x-1 transition-transform">
                <Package className="h-4 w-4" />
                Estoque
              </Button>
            </div>

            <div className="mb-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gestão de Pessoas</p>
              <Button variant="ghost" className="w-full justify-start gap-3 hover:translate-x-1 transition-transform">
                <ClipboardList className="h-4 w-4" />
                Treinamentos & Exames
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 hover:translate-x-1 transition-transform">
                <AlertCircle className="h-4 w-4" />
                Acidentes & Relatórios
              </Button>
            </div>

            <div>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Configurações</p>
              <Button variant="ghost" className="w-full justify-start gap-3 hover:translate-x-1 transition-transform">
                <Settings className="h-4 w-4" />
                Preferências do sistema
              </Button>
            </div>
          </nav>

          {/* User Profile */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3 transition-all hover:bg-secondary cursor-pointer">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">LA</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Lara Arantes</p>
                <p className="text-xs text-muted-foreground truncate">lara@servgaia</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-6 backdrop-blur-sm bg-card/95">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden transition-transform hover:rotate-90"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors" />
              <Input
                placeholder="Buscar funcionário, empresa, cargo..."
                className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <Button variant="ghost" size="icon" className="relative transition-transform hover:scale-110">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive animate-pulse-subtle" />
          </Button>

          <div className="hidden items-center gap-2 md:flex">
            <span className="text-sm font-medium">Lara Arantes</span>
            <Avatar className="transition-transform hover:scale-110">
              <AvatarFallback className="bg-primary text-primary-foreground">LA</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 space-y-6">
          {/* Page Title */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-slideUp">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Painel administrativo</h1>
              <p className="text-muted-foreground mt-1">Panorama geral dos EPIs, equipe e alertas operacionais.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="btn-hover-lift">Exportar</Button>
              <Button className="btn-hover-lift">Nova movimentação</Button>
            </div>
          </div>

          {/* Stats Grid - Enhanced */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="animate-fadeIn shadow-sm hover:shadow-md transition-shadow duration-300" style={{ animationDelay: '0ms' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium">Alertas de EPIs</CardDescription>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 text-destructive animate-pulse-subtle" />
                  </div>
                </div>
                <CardTitle className="text-4xl font-bold tabular-nums">1</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs">
                  <TrendingDown className="h-3 w-3 text-chart-2" />
                  <span className="text-chart-2 font-medium">-50%</span>
                  <span className="text-muted-foreground">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fadeIn shadow-sm hover:shadow-md transition-shadow duration-300" style={{ animationDelay: '100ms' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium">Estoque baixo</CardDescription>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
                    <Package className="h-4 w-4 text-chart-1" />
                  </div>
                </div>
                <CardTitle className="text-4xl font-bold tabular-nums">17</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="h-3 w-3 text-destructive" />
                  <span className="text-destructive font-medium">+3</span>
                  <span className="text-muted-foreground">esta semana</span>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fadeIn shadow-sm hover:shadow-md transition-shadow duration-300" style={{ animationDelay: '200ms' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium">Funcionários ativos</CardDescription>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
                    <Users className="h-4 w-4 text-chart-2" />
                  </div>
                </div>
                <CardTitle className="text-4xl font-bold tabular-nums">29</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="h-3 w-3 text-chart-2" />
                  <span className="text-chart-2 font-medium">+2</span>
                  <span className="text-muted-foreground">este mês</span>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fadeIn shadow-sm hover:shadow-md transition-shadow duration-300" style={{ animationDelay: '300ms' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium">EPIs em uso</CardDescription>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
                    <CheckCircle2 className="h-4 w-4 text-chart-3" />
                  </div>
                </div>
                <CardTitle className="text-4xl font-bold tabular-nums">156</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="h-3 w-3 text-chart-2" />
                  <span className="text-chart-2 font-medium">+12%</span>
                  <span className="text-muted-foreground">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Produtos mais utilizados */}
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Produtos mais utilizados</CardTitle>
                    <CardDescription>Distribuição por categoria nos últimos 30 dias</CardDescription>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    235 total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {[
                    { nome: 'Capacete de Segurança', quantidade: 45, cor: 'hsl(var(--chart-1))', percent: 90, variacao: '+12%' },
                    { nome: 'Luvas de Proteção', quantidade: 38, cor: 'hsl(var(--chart-2))', percent: 76, variacao: '+8%' },
                    { nome: 'Óculos de Proteção', quantidade: 28, cor: 'hsl(var(--chart-3))', percent: 56, variacao: '-3%' },
                    { nome: 'Botas de Segurança', quantidade: 22, cor: 'hsl(var(--chart-4))', percent: 44, variacao: '+5%' },
                    { nome: 'Protetor Auricular', quantidade: 15, cor: 'hsl(var(--chart-5))', percent: 30, variacao: '0%' },
                  ].map((item, index) => (
                    <div key={index} className="group animate-slideInRight space-y-2" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-3 w-3 rounded-full transition-transform group-hover:scale-110"
                            style={{ backgroundColor: item.cor }}
                          />
                          <span className="text-sm font-medium">{item.nome}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-medium ${item.variacao.startsWith('+') ? 'text-chart-2' : item.variacao.startsWith('-') ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {item.variacao}
                          </span>
                          <span className="text-sm font-semibold tabular-nums">{item.quantidade}</span>
                        </div>
                      </div>
                      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div 
                          className="h-full animate-progressBar transition-all duration-500 group-hover:opacity-80"
                          style={{ 
                            width: `${item.percent}%`,
                            backgroundColor: item.cor
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alertas recentes - Sidebar */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Alertas críticos</CardTitle>
                    <CardDescription className="text-xs mt-1">Itens vencidos ou próximos</CardDescription>
                  </div>
                  <Badge variant="destructive" className="animate-pulse-subtle">3</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { nome: 'Matheus O F Stapf', produto: 'Capacete Segurança', dias: 79, urgencia: 'critico' },
                  { nome: 'Carlos H Santos', produto: 'Luvas de Proteção', dias: 15, urgencia: 'alto' },
                  { nome: 'Ana M Silva', produto: 'Óculos de Proteção', dias: 5, urgencia: 'medio' },
                ].map((alerta, index) => (
                  <div 
                    key={index} 
                    className="animate-fadeIn group rounded-lg border border-border bg-secondary/30 p-3 transition-all hover:bg-secondary/50 hover:border-destructive/50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold leading-none">{alerta.nome}</p>
                        <p className="text-xs text-muted-foreground">{alerta.produto}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${alerta.urgencia === 'critico' ? 'border-destructive text-destructive' : alerta.urgencia === 'alto' ? 'border-chart-1 text-chart-1' : 'border-muted-foreground text-muted-foreground'}`}
                          >
                            Vencido há {alerta.dias} dias
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="link" className="h-auto p-0 w-full justify-start text-xs hover:gap-2 transition-all">
                  Ver todos os alertas
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Movimentações e Resumo */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Movimentações recentes */}
            <Card className="lg:col-span-2 shadow-sm card-hover">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Movimentações recentes</CardTitle>
                    <CardDescription>Últimas entradas e saídas</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="btn-hover-lift">Ver todas</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Funcionário</TableHead>
                      <TableHead className="text-right">Qtd</TableHead>
                      <TableHead className="text-right">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="animate-fadeIn hover:bg-secondary/50 transition-colors" style={{ animationDelay: '0ms' }}>
                      <TableCell>
                        <Badge variant="outline" className="text-destructive border-destructive badge-animate">Saída</Badge>
                      </TableCell>
                      <TableCell className="font-medium">Luvas de Proteção</TableCell>
                      <TableCell className="text-muted-foreground">Amanda Guimarães</TableCell>
                      <TableCell className="text-right tabular-nums">2</TableCell>
                      <TableCell className="text-right text-muted-foreground">12/02/2026</TableCell>
                    </TableRow>
                    <TableRow className="animate-fadeIn hover:bg-secondary/50 transition-colors" style={{ animationDelay: '100ms' }}>
                      <TableCell>
                        <Badge variant="outline" className="text-chart-2 border-chart-2 badge-animate">Entrada</Badge>
                      </TableCell>
                      <TableCell className="font-medium">Capacete de Segurança</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                      <TableCell className="text-right tabular-nums">10</TableCell>
                      <TableCell className="text-right text-muted-foreground">10/02/2026</TableCell>
                    </TableRow>
                    <TableRow className="animate-fadeIn hover:bg-secondary/50 transition-colors" style={{ animationDelay: '200ms' }}>
                      <TableCell>
                        <Badge variant="outline" className="text-destructive border-destructive badge-animate">Saída</Badge>
                      </TableCell>
                      <TableCell className="font-medium">Bota de Segurança</TableCell>
                      <TableCell className="text-muted-foreground">Carlos Henrique</TableCell>
                      <TableCell className="text-right tabular-nums">1</TableCell>
                      <TableCell className="text-right text-muted-foreground">08/02/2026</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Resumo do mês */}
            <Card className="shadow-sm card-hover">
              <CardHeader>
                <CardTitle className="text-base">Resumo do mês</CardTitle>
                <CardDescription className="text-xs">Fevereiro 2026</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="animate-fadeIn space-y-2" style={{ animationDelay: '0ms' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Entregas realizadas</p>
                    <TrendingUp className="h-3 w-3 text-chart-2" />
                  </div>
                  <p className="text-3xl font-bold tabular-nums">24</p>
                  <p className="text-xs text-chart-2">+18% vs janeiro</p>
                </div>
                <div className="animate-fadeIn space-y-2" style={{ animationDelay: '100ms' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Itens recebidos</p>
                    <TrendingUp className="h-3 w-3 text-chart-2" />
                  </div>
                  <p className="text-3xl font-bold tabular-nums">60</p>
                  <p className="text-xs text-chart-2">+25% vs janeiro</p>
                </div>
                <div className="animate-fadeIn space-y-2" style={{ animationDelay: '200ms' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Valor em estoque</p>
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  </div>
                  <p className="text-3xl font-bold tabular-nums">R$ 12.450</p>
                  <p className="text-xs text-destructive">-5% vs janeiro</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Movimentação de Estoque */}
            <Card className="shadow-sm card-hover animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Movimentação de estoque</CardTitle>
                    <CardDescription>Últimos 6 meses</CardDescription>
                  </div>
                  <Badge variant="secondary" className="badge-animate">Quantidade</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    quantidade: {
                      label: 'Quantidade',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                  className="h-[280px]"
                >
                  <BarChart data={estoqueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis 
                      dataKey="mes" 
                      className="text-xs"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="quantidade" 
                      fill="hsl(var(--chart-1))"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Média mensal</p>
                    <p className="text-xl font-bold tabular-nums">256</p>
                  </div>
                  <div className="flex items-center gap-1 text-chart-2">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-semibold">+8.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de EPIs */}
            <Card className="shadow-sm card-hover animate-fadeIn" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Distribuição de EPIs</CardTitle>
                    <CardDescription>Por tipo de equipamento</CardDescription>
                  </div>
                  <Badge variant="secondary" className="badge-animate">235 total</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <ChartContainer
                    config={{
                      capacete: { label: 'Capacete', color: 'hsl(var(--chart-1))' },
                      luvas: { label: 'Luvas', color: 'hsl(var(--chart-2))' },
                      botas: { label: 'Botas', color: 'hsl(var(--chart-3))' },
                      oculos: { label: 'Óculos', color: 'hsl(var(--chart-4))' },
                      outros: { label: 'Outros', color: 'hsl(var(--chart-5))' },
                    }}
                    className="h-[280px] flex-1"
                  >
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={episPorTipo}
                        dataKey="quantidade"
                        nameKey="tipo"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        strokeWidth={2}
                      >
                        {episPorTipo.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.cor}
                            className="transition-opacity hover:opacity-80"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="flex-1 space-y-3">
                    {episPorTipo.map((item, index) => (
                      <div key={index} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full transition-transform group-hover:scale-110"
                            style={{ backgroundColor: item.cor }}
                          />
                          <span className="text-sm text-muted-foreground">{item.tipo}</span>
                        </div>
                        <span className="text-sm font-semibold tabular-nums">{item.quantidade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tendência de Entregas */}
          <Card className="shadow-sm card-hover animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Entregas diárias</CardTitle>
                  <CardDescription>Últimos 7 dias - Tendência de distribuição</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-chart-3 animate-pulse-subtle" />
                    <span className="text-xs text-muted-foreground">Entregas</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  entregas: {
                    label: 'Entregas',
                    color: 'hsl(var(--chart-3))',
                  },
                }}
                className="h-[260px]"
              >
                <LineChart data={entregasRecentes}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis 
                    dataKey="data" 
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone"
                    dataKey="entregas" 
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2.5}
                    dot={{ 
                      fill: 'hsl(var(--chart-3))', 
                      r: 4,
                      strokeWidth: 2,
                      stroke: 'hsl(var(--card))'
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
              <div className="mt-4 grid gap-4 border-t border-border pt-4 md:grid-cols-4">
                <div className="space-y-1 animate-fadeIn" style={{ animationDelay: '0ms' }}>
                  <p className="text-xs text-muted-foreground">Total entregas</p>
                  <p className="text-2xl font-bold tabular-nums">75</p>
                </div>
                <div className="space-y-1 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                  <p className="text-xs text-muted-foreground">Média diária</p>
                  <p className="text-2xl font-bold tabular-nums">10.7</p>
                </div>
                <div className="space-y-1 animate-fadeIn" style={{ animationDelay: '200ms' }}>
                  <p className="text-xs text-muted-foreground">Pico máximo</p>
                  <p className="text-2xl font-bold tabular-nums">15</p>
                </div>
                <div className="space-y-1 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                  <p className="text-xs text-muted-foreground">Crescimento</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-chart-2" />
                    <p className="text-2xl font-bold tabular-nums text-chart-2">+16%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  )
}
