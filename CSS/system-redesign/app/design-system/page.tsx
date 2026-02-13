'use client'

import { useState } from 'react'
import { Bell, Search, Menu, X, Home, Palette, Check, Copy, BarChart3, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Area, AreaChart, CartesianGrid, XAxis, YAxis, Cell, Legend, ResponsiveContainer } from 'recharts'
import { Progress } from '@/components/ui/progress'

const colorPalettes = [
  {
    name: 'Azul Corporativo (Atual)',
    primary: '#1a2332',
    secondary: '#ebf0f5',
    accent: '#3b82f6',
    description: 'Paleta profissional com azul escuro e tons neutros',
    colors: [
      { name: 'Primary', hex: '#1a2332', var: '--primary' },
      { name: 'Secondary', hex: '#ebf0f5', var: '--secondary' },
      { name: 'Accent Blue', hex: '#3b82f6', var: '--chart-1' },
      { name: 'Light Blue', hex: '#60a5fa', var: '--chart-2' },
      { name: 'Sky Blue', hex: '#3b82f6', var: '--chart-3' },
    ]
  },
  {
    name: 'Verde Sustentável',
    primary: '#064e3b',
    secondary: '#f0fdf4',
    accent: '#10b981',
    description: 'Paleta que transmite crescimento e sustentabilidade',
    colors: [
      { name: 'Primary', hex: '#064e3b', var: '--primary' },
      { name: 'Secondary', hex: '#f0fdf4', var: '--secondary' },
      { name: 'Emerald', hex: '#10b981', var: '--chart-1' },
      { name: 'Green', hex: '#22c55e', var: '--chart-2' },
      { name: 'Teal', hex: '#14b8a6', var: '--chart-3' },
    ]
  },
  {
    name: 'Cinza Executivo',
    primary: '#18181b',
    secondary: '#f4f4f5',
    accent: '#71717a',
    description: 'Minimalista e elegante para ambientes corporativos',
    colors: [
      { name: 'Primary', hex: '#18181b', var: '--primary' },
      { name: 'Secondary', hex: '#f4f4f5', var: '--secondary' },
      { name: 'Gray', hex: '#71717a', var: '--chart-1' },
      { name: 'Slate', hex: '#64748b', var: '--chart-2' },
      { name: 'Zinc', hex: '#52525b', var: '--chart-3' },
    ]
  },
  {
    name: 'Roxo Tecnológico',
    primary: '#581c87',
    secondary: '#faf5ff',
    accent: '#a855f7',
    description: 'Moderno e inovador, ideal para tech companies',
    colors: [
      { name: 'Primary', hex: '#581c87', var: '--primary' },
      { name: 'Secondary', hex: '#faf5ff', var: '--secondary' },
      { name: 'Purple', hex: '#a855f7', var: '--chart-1' },
      { name: 'Violet', hex: '#8b5cf6', var: '--chart-2' },
      { name: 'Fuchsia', hex: '#d946ef', var: '--chart-3' },
    ]
  },
  {
    name: 'Laranja Energético',
    primary: '#7c2d12',
    secondary: '#fff7ed',
    accent: '#f97316',
    description: 'Vibrante e dinâmico para ambientes criativos',
    colors: [
      { name: 'Primary', hex: '#7c2d12', var: '--primary' },
      { name: 'Secondary', hex: '#fff7ed', var: '--secondary' },
      { name: 'Orange', hex: '#f97316', var: '--chart-1' },
      { name: 'Amber', hex: '#f59e0b', var: '--chart-2' },
      { name: 'Yellow', hex: '#eab308', var: '--chart-3' },
    ]
  },
]

const componentExamples = {
  buttons: [
    { variant: 'default', label: 'Primary' },
    { variant: 'secondary', label: 'Secondary' },
    { variant: 'outline', label: 'Outline' },
    { variant: 'ghost', label: 'Ghost' },
    { variant: 'destructive', label: 'Destructive' },
  ],
  badges: [
    { variant: 'default', label: 'Default' },
    { variant: 'secondary', label: 'Secondary' },
    { variant: 'outline', label: 'Outline' },
    { variant: 'destructive', label: 'Destructive' },
  ],
}

// Dados para exemplos de gráficos
const barChartData = [
  { month: 'Jan', value: 186 },
  { month: 'Fev', value: 305 },
  { month: 'Mar', value: 237 },
  { month: 'Abr', value: 273 },
  { month: 'Mai', value: 209 },
  { month: 'Jun', value: 314 },
]

const lineChartData = [
  { date: '01/02', entregas: 12, retiradas: 8 },
  { date: '02/02', entregas: 19, retiradas: 11 },
  { date: '03/02', entregas: 15, retiradas: 14 },
  { date: '04/02', entregas: 22, retiradas: 16 },
  { date: '05/02', entregas: 18, retiradas: 12 },
  { date: '06/02', entregas: 25, retiradas: 18 },
]

const pieChartData = [
  { name: 'Categoria A', value: 400, color: 'hsl(var(--chart-1))' },
  { name: 'Categoria B', value: 300, color: 'hsl(var(--chart-2))' },
  { name: 'Categoria C', value: 200, color: 'hsl(var(--chart-3))' },
  { name: 'Categoria D', value: 100, color: 'hsl(var(--chart-4))' },
]

const areaChartData = [
  { month: 'Jan', valor: 2400 },
  { month: 'Fev', valor: 1398 },
  { month: 'Mar', valor: 3800 },
  { month: 'Abr', valor: 3908 },
  { month: 'Mai', valor: 4800 },
  { month: 'Jun', valor: 3800 },
]

export default function DesignSystemPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedColor(label)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Simplified Header for Demo */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <Palette className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">Design System</h1>
            <p className="text-xs text-muted-foreground">Guia de estilo e componentes</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/">Voltar ao Dashboard</a>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-6 space-y-8">
        {/* Introduction */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Sistema de Design</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Guia completo de estilos, cores e componentes para manter consistência visual em todo o sistema.
          </p>
        </div>

        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="colors">Cores</TabsTrigger>
            <TabsTrigger value="components">Componentes</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
            <TabsTrigger value="typography">Tipografia</TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Paletas de Cores</h2>
              <p className="text-muted-foreground">
                Escolha uma paleta que melhor representa a identidade da sua empresa.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {colorPalettes.map((palette, index) => (
                <Card key={index} className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{palette.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {palette.description}
                        </CardDescription>
                      </div>
                      {index === 0 && (
                        <Badge variant="default">Em uso</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Color Preview */}
                    <div className="flex gap-2 h-20 rounded-lg overflow-hidden border border-border">
                      <div 
                        className="flex-1" 
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div 
                        className="flex-1" 
                        style={{ backgroundColor: palette.secondary }}
                      />
                      <div 
                        className="flex-1" 
                        style={{ backgroundColor: palette.accent }}
                      />
                    </div>

                    {/* Color Details */}
                    <div className="space-y-2">
                      {palette.colors.map((color, colorIndex) => (
                        <div 
                          key={colorIndex}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="h-8 w-8 rounded border border-border"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div>
                              <p className="text-sm font-medium">{color.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(color.hex, `${palette.name}-${color.name}`)}
                          >
                            {copiedColor === `${palette.name}-${color.name}` ? (
                              <Check className="h-4 w-4 text-chart-2" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>

                    {index !== 0 && (
                      <Button variant="outline" className="w-full">
                        Aplicar esta paleta
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Current Theme Colors */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Cores do Tema Atual</CardTitle>
                <CardDescription>
                  Variáveis CSS disponíveis para uso no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: 'Background', var: '--background', demo: 'bg-background' },
                    { name: 'Foreground', var: '--foreground', demo: 'bg-foreground' },
                    { name: 'Primary', var: '--primary', demo: 'bg-primary' },
                    { name: 'Secondary', var: '--secondary', demo: 'bg-secondary' },
                    { name: 'Muted', var: '--muted', demo: 'bg-muted' },
                    { name: 'Accent', var: '--accent', demo: 'bg-accent' },
                    { name: 'Destructive', var: '--destructive', demo: 'bg-destructive' },
                    { name: 'Border', var: '--border', demo: 'bg-border' },
                    { name: 'Chart 1', var: '--chart-1', demo: 'bg-chart-1' },
                    { name: 'Chart 2', var: '--chart-2', demo: 'bg-chart-2' },
                    { name: 'Chart 3', var: '--chart-3', demo: 'bg-chart-3' },
                    { name: 'Chart 4', var: '--chart-4', demo: 'bg-chart-4' },
                  ].map((color, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors"
                    >
                      <div className={`h-10 w-10 rounded ${color.demo} border border-border`} />
                      <div>
                        <p className="text-sm font-medium">{color.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{color.var}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Componentes</h2>
              <p className="text-muted-foreground">
                Biblioteca de componentes disponíveis no sistema.
              </p>
            </div>

            {/* Buttons */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Botões</CardTitle>
                <CardDescription>Variações de botões disponíveis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-3">Tamanhos</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Variantes</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {componentExamples.buttons.map((btn, index) => (
                      <Button key={index} variant={btn.variant as any}>
                        {btn.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Com ícones</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button>
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button variant="secondary">
                      <Search className="mr-2 h-4 w-4" />
                      Buscar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Indicadores visuais de status e categorias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-3">Variantes</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {componentExamples.badges.map((badge, index) => (
                      <Badge key={index} variant={badge.variant as any}>
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Com ícones</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
                      <Check className="mr-1 h-3 w-3" />
                      Ativo
                    </Badge>
                    <Badge variant="destructive">
                      <X className="mr-1 h-3 w-3" />
                      Inativo
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cards */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Cards</CardTitle>
                <CardDescription>Containers para agrupar conteúdo relacionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Card Simples</CardTitle>
                      <CardDescription>Descrição do card</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Conteúdo do card...</p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-chart-1">
                    <CardHeader>
                      <CardTitle className="text-base">Com Borda</CardTitle>
                      <CardDescription>Borda colorida à esquerda</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Conteúdo do card...</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base">Com Sombra</CardTitle>
                      <CardDescription>Sombra elevada</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Conteúdo do card...</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Inputs */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Inputs</CardTitle>
                <CardDescription>Campos de entrada de dados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-w-md space-y-2">
                  <label className="text-sm font-medium">Input padrão</label>
                  <Input placeholder="Digite algo..." />
                </div>

                <div className="max-w-md space-y-2">
                  <label className="text-sm font-medium">Com ícone</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Buscar..." className="pl-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Gráficos e Visualizações</h2>
              <p className="text-muted-foreground">
                Exemplos de gráficos e visualizações de dados disponíveis no sistema.
              </p>
            </div>

            {/* Bar Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gráfico de Barras</CardTitle>
                    <CardDescription className="mt-1">Ideal para comparar valores entre categorias</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    <BarChart3 className="mr-1 h-3 w-3" />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: 'Valor',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                  className="h-[300px]"
                >
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      className="text-xs"
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--chart-1))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
                <div className="mt-4 rounded-lg bg-secondary/50 p-4">
                  <p className="text-sm font-medium mb-2">Quando usar:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Comparar valores entre diferentes categorias</li>
                    <li>• Mostrar evolução ao longo do tempo (mensal, semanal)</li>
                    <li>• Destacar diferenças entre grupos de dados</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gráfico de Linhas</CardTitle>
                    <CardDescription className="mt-1">Perfeito para tendências e séries temporais</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Line Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    entregas: {
                      label: 'Entregas',
                      color: 'hsl(var(--chart-2))',
                    },
                    retiradas: {
                      label: 'Retiradas',
                      color: 'hsl(var(--chart-3))',
                    },
                  }}
                  className="h-[300px]"
                >
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      className="text-xs"
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone"
                      dataKey="entregas" 
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                    />
                    <Line 
                      type="monotone"
                      dataKey="retiradas" 
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--chart-3))', r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
                <div className="mt-4 rounded-lg bg-secondary/50 p-4">
                  <p className="text-sm font-medium mb-2">Quando usar:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Mostrar tendências e padrões ao longo do tempo</li>
                    <li>• Comparar múltiplas séries de dados simultaneamente</li>
                    <li>• Visualizar crescimento, declínio ou variações</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pie Chart */}
              <Card className="shadow-sm">
                <CardHeader>
                  <div>
                    <CardTitle>Gráfico de Pizza (Donut)</CardTitle>
                    <CardDescription className="mt-1">Mostrar proporções e distribuição percentual</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      catA: { label: 'Categoria A', color: 'hsl(var(--chart-1))' },
                      catB: { label: 'Categoria B', color: 'hsl(var(--chart-2))' },
                      catC: { label: 'Categoria C', color: 'hsl(var(--chart-3))' },
                      catD: { label: 'Categoria D', color: 'hsl(var(--chart-4))' },
                    }}
                    className="h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-4 space-y-2">
                    {pieChartData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground">
                      Ideal para visualizar partes de um todo, distribuição percentual e composição de dados.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Area Chart */}
              <Card className="shadow-sm">
                <CardHeader>
                  <div>
                    <CardTitle>Gráfico de Área</CardTitle>
                    <CardDescription className="mt-1">Enfatizar volume e magnitude ao longo do tempo</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      valor: {
                        label: 'Valor',
                        color: 'hsl(var(--chart-3))',
                      },
                    }}
                    className="h-[250px]"
                  >
                    <AreaChart data={areaChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        className="text-xs"
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone"
                        dataKey="valor" 
                        stroke="hsl(var(--chart-3))"
                        fill="hsl(var(--chart-3))"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                  <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground">
                      Útil para mostrar volume acumulado, destacar mudanças drásticas e visualizar magnitude de forma mais impactante.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Bars */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Barras de Progresso</CardTitle>
                <CardDescription>Indicadores visuais de preenchimento e metas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Meta de Estoque</span>
                    <span className="text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Funcionários Ativos</span>
                    <span className="text-muted-foreground">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">EPIs em Conformidade</span>
                    <span className="text-muted-foreground">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Entregas Realizadas</span>
                    <span className="text-muted-foreground">43%</span>
                  </div>
                  <Progress value={43} className="h-2" />
                </div>

                <div className="mt-4 rounded-lg bg-secondary/50 p-4">
                  <p className="text-sm font-medium mb-2">Quando usar:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Mostrar progresso em relação a uma meta</li>
                    <li>• Indicar nível de preenchimento ou capacidade</li>
                    <li>• Visualizar percentuais de forma linear e simples</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Chart Colors */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Paleta de Cores para Gráficos</CardTitle>
                <CardDescription>Cores padronizadas para visualizações de dados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {[
                    { name: 'Chart 1', var: '--chart-1', class: 'bg-chart-1' },
                    { name: 'Chart 2', var: '--chart-2', class: 'bg-chart-2' },
                    { name: 'Chart 3', var: '--chart-3', class: 'bg-chart-3' },
                    { name: 'Chart 4', var: '--chart-4', class: 'bg-chart-4' },
                    { name: 'Chart 5', var: '--chart-5', class: 'bg-chart-5' },
                  ].map((color, index) => (
                    <div key={index} className="space-y-2">
                      <div className={`h-20 rounded-lg ${color.class}`} />
                      <div>
                        <p className="text-sm font-medium">{color.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{color.var}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-lg bg-secondary/50 p-4">
                  <p className="text-sm font-medium mb-2">Dicas de uso:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use cores contrastantes para dados que precisam ser diferenciados</li>
                    <li>• Mantenha consistência: mesma cor para o mesmo tipo de dado</li>
                    <li>• Evite usar mais de 5 cores em um único gráfico</li>
                    <li>• Considere acessibilidade: cores devem ser distinguíveis</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tipografia</h2>
              <p className="text-muted-foreground">
                Hierarquia de texto e estilos tipográficos do sistema.
              </p>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Fontes</CardTitle>
                <CardDescription>Famílias tipográficas utilizadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Sans-serif (Principal)</p>
                  <p className="text-2xl font-sans">Inter - Aa Bb Cc 123</p>
                  <p className="text-sm text-muted-foreground font-mono">font-family: var(--font-inter)</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Monospace (Código)</p>
                  <p className="text-2xl font-mono">Space Mono - Aa Bb Cc 123</p>
                  <p className="text-sm text-muted-foreground font-mono">font-family: var(--font-space-mono)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Hierarquia de Títulos</CardTitle>
                <CardDescription>Tamanhos e pesos de texto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-4xl font-bold">Heading 1 - 36px Bold</h1>
                  <p className="text-sm text-muted-foreground font-mono">text-4xl font-bold</p>
                </div>

                <div className="space-y-1">
                  <h2 className="text-3xl font-bold">Heading 2 - 30px Bold</h2>
                  <p className="text-sm text-muted-foreground font-mono">text-3xl font-bold</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">Heading 3 - 24px Bold</h3>
                  <p className="text-sm text-muted-foreground font-mono">text-2xl font-bold</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-semibold">Heading 4 - 20px Semibold</h4>
                  <p className="text-sm text-muted-foreground font-mono">text-xl font-semibold</p>
                </div>

                <div className="space-y-1">
                  <h5 className="text-lg font-semibold">Heading 5 - 18px Semibold</h5>
                  <p className="text-sm text-muted-foreground font-mono">text-lg font-semibold</p>
                </div>

                <div className="space-y-1">
                  <p className="text-base">Body - 16px Regular</p>
                  <p className="text-sm text-muted-foreground font-mono">text-base</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm">Small - 14px Regular</p>
                  <p className="text-sm text-muted-foreground font-mono">text-sm</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs">Extra Small - 12px Regular</p>
                  <p className="text-sm text-muted-foreground font-mono">text-xs</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Estilos de Texto</CardTitle>
                <CardDescription>Variações de peso e estilo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-bold">Bold - Peso 700</p>
                <p className="font-semibold">Semibold - Peso 600</p>
                <p className="font-medium">Medium - Peso 500</p>
                <p className="font-normal">Regular - Peso 400</p>
                <p className="text-muted-foreground">Muted - Texto secundário</p>
                <p className="font-mono">Monospace - Código e dados técnicos</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
