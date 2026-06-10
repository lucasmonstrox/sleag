import {
  BellRingIcon,
  ClapperboardIcon,
  GaugeIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  PackageSearchIcon,
  RadioIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  StoreIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export type NavGroup = {
  label?: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [{ title: "Dashboard", href: "/", icon: LayoutDashboardIcon }],
  },
  {
    label: "Descoberta",
    items: [
      { title: "Produtos", href: "/produtos", icon: PackageSearchIcon },
      { title: "Lojas", href: "/lojas", icon: StoreIcon },
      { title: "Categorias", href: "/categorias", icon: LayoutGridIcon },
    ],
  },
  {
    label: "Conteúdo",
    items: [
      { title: "Criadores", href: "/criadores", icon: UsersIcon },
      { title: "Vídeos & criativos", href: "/videos", icon: ClapperboardIcon },
      { title: "Lives", href: "/lives", icon: RadioIcon },
    ],
  },
  {
    label: "Minha operação",
    items: [
      { title: "Desempenho", href: "/desempenho", icon: WalletIcon },
      { title: "Regras", href: "/monitoramento", icon: SlidersHorizontalIcon },
      { title: "Alertas", href: "/alertas", icon: BellRingIcon },
    ],
  },
]

/**
 * Rotas fora da sidebar (acessadas pelo menu do avatar),
 * mas que ainda precisam de breadcrumb no topbar.
 */
export const HIDDEN_NAV_GROUPS: NavGroup[] = [
  {
    label: "Mercado",
    items: [{ title: "Score & quadrante", href: "/score", icon: GaugeIcon }],
  },
  {
    label: "Minha operação",
    items: [{ title: "Conta", href: "/conta", icon: SettingsIcon }],
  },
]
