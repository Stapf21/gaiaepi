import { type LucideIcon } from "lucide-react"

interface PlaceholderPageProps {
  tag: string
  title: string
  description: string
  icon: LucideIcon
}

export function PlaceholderPage({ tag, title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          {tag}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-24">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          Em desenvolvimento
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Esta secao sera implementada em breve.
        </p>
      </div>
    </div>
  )
}
