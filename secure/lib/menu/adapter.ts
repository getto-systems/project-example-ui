import { BreadcrumbCategory, BreadcrumbItem, MenuCategory, MenuItem } from "./data"

export function packBreadcrumbCategory(category: string): BreadcrumbCategory {
    return category as BreadcrumbCategory & string
}

export function unpackBreadcrumbCategory(category: BreadcrumbCategory): string {
    return (category as unknown) as string
}

export function packBreadcrumbItem(item: BreadcrumbItem_data): BreadcrumbItem {
    return item as BreadcrumbItem & BreadcrumbItem_data
}

export function unpackBreadcrumbItem(item: BreadcrumbItem): BreadcrumbItem_data {
    return (item as unknown) as BreadcrumbItem_data
}

type BreadcrumbItem_data = Readonly<{
    label: string
    icon: string
    href: string
}>

export function packMenuCategory(category: MenuCategory_data): MenuCategory {
    return category as MenuCategory & MenuCategory_data
}

export function unpackMenuCategory(category: MenuCategory): MenuCategory_data {
    return (category as unknown) as MenuCategory_data
}

export function packMenuItem(item: MenuItem_data): MenuItem {
    return item as MenuItem & MenuItem_data
}

export function unpackMenuItem(item: MenuItem): MenuItem_data {
    return (item as unknown) as MenuItem_data
}

type MenuCategory_data = Readonly<{
    isExpand: boolean
    label: string
    badgeCount: number
}>

type MenuItem_data = Readonly<{
    isActive: boolean
    href: string
    label: string
    icon: string
    badgeCount: number
}>
