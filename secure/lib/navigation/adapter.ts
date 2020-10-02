import { BreadcrumbCategory, BreadcrumbItem } from "./data"

export function packBreadcrumbCategory(category: string): BreadcrumbCategory {
    return category as BreadcrumbCategory & string
}

export function unpackBreadcrumbCategory(category: BreadcrumbCategory): string {
    return category as unknown as string
}

export function packBreadcrumbItem(item: BreadcrumbItem_data): BreadcrumbItem {
    return item as BreadcrumbItem & BreadcrumbItem_data
}

export function unpackBreadcrumbItem(item: BreadcrumbItem): BreadcrumbItem_data {
    return item as unknown as BreadcrumbItem_data
}

type BreadcrumbItem_data = Readonly<{
    label: string
    icon: string
    href: string
}>
