export type MenuLabel = { MenuLabel: never }
export type MenuIcon = { MenuIcon: never }
export type MenuHref = { MenuHref: never }
export type MenuBadgeCount = { MenuBadgeCount: never }

export type MenuVersion = { MenuVersion: never }
export type MenuPath = { MenuPath: never }

export type MenuPathInfo = Readonly<{
    version: MenuVersion
    currentPath: MenuPath
}>

export type Breadcrumb = BreadcrumbNode[]

export type BreadcrumbNode =
    | Readonly<{ type: "category"; category: BreadcrumbCategory }>
    | Readonly<{ type: "item"; item: BreadcrumbItem }>

export type BreadcrumbCategory = Readonly<{ label: MenuLabel }>
export type BreadcrumbItem = Readonly<{
    label: MenuLabel
    icon: MenuIcon
    href: MenuHref
}>

export type LoadBreadcrumbEvent = Readonly<{ type: "succeed-to-load"; breadcrumb: Breadcrumb }>

export type Menu = MenuNode[]
export type MenuNode =
    | Readonly<{ type: "category"; category: MenuCategory; children: Menu }>
    | Readonly<{ type: "item"; item: MenuItem }>

export type MenuCategory = Readonly<{
    isExpand: boolean
    label: MenuLabel
    badgeCount: MenuBadgeCount
}>

export type MenuItem = Readonly<{
    isActive: boolean
    href: MenuHref
    label: MenuLabel
    icon: MenuIcon
    badgeCount: MenuBadgeCount
}>

export type LoadMenuEvent =
    | Readonly<{ type: "succeed-to-load"; menu: Menu }>
    | Readonly<{ type: "failed-to-load"; menu: Menu; err: LoadMenuError }>

export type LoadMenuError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
