export type Breadcrumb = BreadcrumbNode[]

export type BreadcrumbNode =
    | Readonly<{ type: "category"; category: BreadcrumbCategory }>
    | Readonly<{ type: "item"; item: BreadcrumbItem }>

export type BreadcrumbCategory = { BreadcrumbCategory: never }
export type BreadcrumbItem = { BreadcrumbItem: never }

export type LoadBreadcrumbEvent = Readonly<{ type: "succeed-to-load"; breadcrumb: Breadcrumb }>

export type Menu = MenuNode[]
export type MenuNode =
    | Readonly<{ type: "category"; category: MenuCategory; children: Menu }>
    | Readonly<{ type: "item"; item: MenuItem }>

export type MenuCategory = { MenuCategory: never }
export type MenuItem = { MenuItem: never }

export type LoadMenuEvent =
    | Readonly<{ type: "succeed-to-load"; menu: Menu }>
    | Readonly<{ type: "failed-to-load"; menu: Menu; err: LoadMenuError }>

export type LoadMenuError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
