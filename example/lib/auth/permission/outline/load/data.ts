import { RepositoryError } from "../../../../z_vendor/getto-application/infra/repository/data"

export type OutlineMenuTarget = OutlineMenuTarget_data & { MenuTarget: never }
type OutlineMenuTarget_data =
    | Readonly<{ versioned: false; version: string }>
    | Readonly<{ versioned: true; version: string; currentPath: string }>
export function markOutlineMenuTarget(menuTarget: OutlineMenuTarget_data): OutlineMenuTarget {
    return menuTarget as OutlineMenuTarget
}

export type OutlineBreadcrumb = OutlineBreadcrumbNode[]

export type OutlineBreadcrumbNode =
    | Readonly<{ type: "category"; category: OutlineMenuCategory }>
    | Readonly<{ type: "item"; item: OutlineMenuItem }>

export type OutlineMenuCategory = Readonly<{
    label: OutlineMenuCategoryLabel
}>

export type OutlineMenu = OutlineMenuNode[]
export type OutlineMenuNode = OutlineMenuCategoryNode | OutlineMenuItemNode
export type OutlineMenuCategoryNode = Readonly<{
    type: "category"
    category: OutlineMenuCategory
    path: OutlineMenuCategoryPath
    children: OutlineMenu
    isExpand: boolean
    badgeCount: number
}>
export type OutlineMenuItemNode = Readonly<{
    type: "item"
    item: OutlineMenuItem
    isActive: boolean
    badgeCount: number
}>

export type OutlineMenuCategoryLabel = string & { MenuCategoryLabel: never }
export function markOutlineMenuCategoryLabel(label: string): OutlineMenuCategoryLabel {
    return label as OutlineMenuCategoryLabel
}
export type OutlineMenuCategoryPath = OutlineMenuCategoryLabel[]

export type OutlineMenuItem = OutlineMenuItem_data & { MenuItem: never }
type OutlineMenuItem_data = Readonly<{
    label: string
    icon: string
    href: string
}>
export function markOutlineMenuItem(item: OutlineMenuItem_data): OutlineMenuItem {
    return item as OutlineMenuItem
}

export type FetchAuthzRepositoryError =
    | Readonly<{ type: "not-found" }>
    | Exclude<RepositoryError, { type: "transform-error" }>

export type LoadOutlineMenuBadgeError = LoadOutlineMenuBadgeRemoteError
export type LoadOutlineMenuBadgeRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
