export type BreadcrumbList = Readonly<{
    category: BreadcrumbCategory
    items: BreadcrumbItem[]
}>[]

export type BreadcrumbCategory = { BreadcrumbCategory: never }
export type BreadcrumbItem = { BreadcrumbItem: never }
