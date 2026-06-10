import { HIDDEN_NAV_GROUPS, NAV_GROUPS } from "../consts"
import type { NavItem } from "../consts"

export type NavMatch = {
  group: string
  item: NavItem
}

export function findNavMatch(pathname: string): NavMatch | null {
  let best: NavMatch | null = null

  for (const group of [...NAV_GROUPS, ...HIDDEN_NAV_GROUPS]) {
    for (const item of group.items) {
      const matches =
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(`${item.href}/`))

      if (matches && (!best || item.href.length > best.item.href.length)) {
        best = { group: group.label, item }
      }
    }
  }

  return best
}
