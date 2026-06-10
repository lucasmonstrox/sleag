import {
  BellIcon,
  ClapperboardIcon,
  GaugeIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  PackageSearchIcon,
  RadioIcon,
  SettingsIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Visão geral",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboardIcon },
      { title: "Score & quadrante", href: "/score", icon: GaugeIcon },
    ],
  },
  {
    label: "Descoberta",
    items: [
      { title: "Produtos", href: "/produtos", icon: PackageSearchIcon },
      { title: "Categorias", href: "/categorias", icon: LayoutGridIcon },
    ],
  },
  {
    label: "Concorrência",
    items: [
      { title: "Criadores", href: "/criadores", icon: UsersIcon },
      { title: "Lojas", href: "/lojas", icon: StoreIcon },
      { title: "Vídeos & criativos", href: "/videos", icon: ClapperboardIcon },
      { title: "Lives", href: "/lives", icon: RadioIcon },
    ],
  },
  {
    label: "Sua operação",
    items: [{ title: "Monitoramento", href: "/monitoramento", icon: BellIcon }],
  },
]

/**
 * Rotas fora da sidebar (acessadas pelo menu do avatar),
 * mas que ainda precisam de breadcrumb no topbar.
 */
export const HIDDEN_NAV_GROUPS: NavGroup[] = [
  {
    label: "Sua operação",
    items: [{ title: "Conta", href: "/conta", icon: SettingsIcon }],
  },
]
