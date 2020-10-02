export type BreadcrumbList = BreadcrumbTree[]
export type BreadcrumbTree = Readonly<{
    category: BreadcrumbCategory
    items: BreadcrumbItem[]
}>
export type BreadcrumbCategory = { BreadcrumbCategory: never }
export type BreadcrumbItem = { BreadcrumbItem: never }

export type NavigationList = NavigationTree[]
export type NavigationTree = Readonly<{
    category: NavigationCategory
    nodes: NavigationNode[]
}>
export type NavigationCategory = { NavigationCategory: never }
export type NavigationItem = { NavigationItem: never }
export type NavigationNode =
    Readonly<{ type: "item", item: NavigationItem }> |
    Readonly<{ type: "tree", tree: NavigationTree }>

export type Expansion = Record<string, boolean>

export type LoadError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
