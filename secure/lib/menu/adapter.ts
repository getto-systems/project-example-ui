import { Icon } from "../z_external/icon"

import { MenuPath, MenuCategory, MenuItem } from "./data"

export function packMenuPath(path: MenuPathData): MenuPath {
    return path as MenuPath & MenuPathData
}
export function unpackMenuPath(path: MenuPath): MenuPathData {
    return (path as unknown) as MenuPathData
}

export function packMenuCategory(category: MenuCategoryData): MenuCategory {
    return category as MenuCategory & MenuCategoryData
}
export function unpackMenuCategory(category: MenuCategory): MenuCategoryData {
    return (category as unknown) as MenuCategoryData
}

export function packMenuItem(item: MenuItemData): MenuItem {
    return item as MenuItem & MenuItemData
}
export function unpackMenuItem(item: MenuItem): MenuItemData {
    return (item as unknown) as MenuItemData
}

export type MenuPathData = Readonly<{
    version: string
    currentPath: string
}>

export type MenuCategoryData = Readonly<{
    label: string
}>
export type MenuItemData = Readonly<{
    label: string
    icon: Icon
    href: string
}>
