export type MenuTarget = MenuTarget_data & { MenuTarget: never }
type MenuTarget_data =
    | Readonly<{ versioned: false; version: string }>
    | Readonly<{ versioned: true; version: string; currentPath: string }>
export function markMenuTarget(menuTarget: MenuTarget_data): MenuTarget {
    return menuTarget as MenuTarget
}

export type MenuCategory = Readonly<{
    label: MenuCategoryLabel
}>

export type MenuCategoryLabel = string & { MenuCategoryLabel: never }
export function markMenuCategoryLabel(label: string): MenuCategoryLabel {
    return label as MenuCategoryLabel
}
export type MenuCategoryPath = MenuCategoryLabel[]

export type MenuItem = MenuItem_data & { MenuItem: never }
type MenuItem_data = Readonly<{
    label: string
    icon: string
    href: string
}>
export function markMenuItem(item: MenuItem_data): MenuItem {
    return item as MenuItem
}

export type Breadcrumb = BreadcrumbNode[]

export type BreadcrumbNode =
    | Readonly<{ type: "category"; category: MenuCategory }>
    | Readonly<{ type: "item"; item: MenuItem }>

export type LoadBreadcrumbEvent = Readonly<{ type: "succeed-to-load"; breadcrumb: Breadcrumb }>

export type Menu = MenuNode[]
export type MenuNode = MenuCategoryNode | MenuItemNode
export type MenuCategoryNode = Readonly<{
    type: "category"
    category: MenuCategory
    path: MenuCategoryPath
    children: Menu
    isExpand: boolean
    badgeCount: number
}>
export type MenuItemNode = Readonly<{
    type: "item"
    item: MenuItem
    isActive: boolean
    badgeCount: number
}>

export type LoadMenuEvent =
    | Readonly<{ type: "succeed-to-instant-load"; menu: Menu }>
    | Readonly<{ type: "succeed-to-load"; menu: Menu }>
    | Readonly<{ type: "failed-to-load"; menu: Menu; err: LoadMenuError }>

export type LoadMenuError =
    | Readonly<{ type: "empty-nonce" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type ToggleMenuExpandEvent =
    | Readonly<{ type: "succeed-to-toggle"; menu: Menu }>
    | Readonly<{ type: "failed-to-toggle"; menu: Menu; err: ToggleMenuExpandError }>

export type ToggleMenuExpandError = Readonly<{ type: "infra-error"; err: string }>
