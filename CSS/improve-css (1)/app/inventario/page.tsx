import { ClipboardCheck } from "lucide-react"
import { PlaceholderPage } from "@/components/placeholder-page"

export default function InventarioPage() {
  return (
    <PlaceholderPage
      tag="Inventario"
      title="Controle de inventario"
      description="Contagem e reconciliacao periodica do estoque fisico."
      icon={ClipboardCheck}
    />
  )
}
