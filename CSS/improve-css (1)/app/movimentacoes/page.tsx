import { ArrowLeftRight } from "lucide-react"
import { PlaceholderPage } from "@/components/placeholder-page"

export default function MovimentacoesPage() {
  return (
    <PlaceholderPage
      tag="Movimentacoes"
      title="Registro de movimentacoes"
      description="Historico completo de todas as movimentacoes de estoque."
      icon={ArrowLeftRight}
    />
  )
}
