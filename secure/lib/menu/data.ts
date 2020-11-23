export type MenuPath = { MenuPath: never }

export type MenuCategory = { MenuCategory: never }
export type MenuItem = { MenuItem: never }

export type Breadcrumb = BreadcrumbNode[]

export type BreadcrumbNode =
    | Readonly<{ type: "category"; category: MenuCategory }>
    | Readonly<{ type: "item"; item: MenuItem }>

export type LoadBreadcrumbEvent = Readonly<{ type: "succeed-to-load"; breadcrumb: Breadcrumb }>

export type Menu = MenuNode[]
export type MenuNode =
    | Readonly<{
          type: "category"
          category: MenuCategory
          children: Menu
          isExpand: boolean
          badgeCount: number
      }>
    | Readonly<{ type: "item"; item: MenuItem; isActive: boolean; badgeCount: number }>

export type LoadMenuEvent =
    | Readonly<{ type: "succeed-to-load"; menu: Menu }>
    | Readonly<{ type: "failed-to-load"; menu: Menu; err: LoadMenuError }>

export type LoadMenuError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
