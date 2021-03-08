import { RemoteTypes } from "../../../z_vendor/getto-application/infra/remote/infra"

import { AuthzNonce } from "../../../common/authz/data"
import {
    GetMenuBadgeRemoteError,
    Menu,
    MenuCategory,
    MenuCategoryLabel,
    MenuCategoryPath,
    MenuItem,
} from "./data"
import { RepositoryPod } from "../../../z_vendor/getto-application/infra/repository/infra"

export type MenuContent = Readonly<{
    key: string
    menuTree: MenuTree
}>

export type MenuTree = MenuTreeNode[]
export type MenuTreeNode =
    | Readonly<{ type: "category"; category: MenuTreeCategory; children: MenuTree }>
    | Readonly<{ type: "item"; item: MenuTreeItem }>

export type MenuTreeCategory = Readonly<{
    label: MenuTreeLabel
    permission: MenuPermission
}>
export type MenuTreeItem = Readonly<{
    path: MenuPath
    label: string
    icon: string
}>

export type MenuTreeLabel = string
export type MenuPath = string

export type MenuPermission =
    | Readonly<{ type: "allow" }>
    | Readonly<{ type: "any"; permits: MenuPermission[] }>
    | Readonly<{ type: "all"; permits: MenuPermission[] }>
    | Readonly<{ type: "role"; role: string }>

export interface MenuStore {
    get(): FetchMenuResult
}
export type FetchMenuResult = Readonly<{ found: true; value: Menu }> | Readonly<{ found: false }>

type GetMenuBadgeRemoteTypes = RemoteTypes<
    AuthzNonce,
    MenuBadge,
    MenuBadgeItem[],
    GetMenuBadgeRemoteError
>
export type GetMenuBadgeRemotePod = GetMenuBadgeRemoteTypes["pod"]
export type GetMenuBadgeRemoteResult = GetMenuBadgeRemoteTypes["result"]
export type GetMenuBadgeSimulator = GetMenuBadgeRemoteTypes["simulator"]

export type MenuBadge = Record<string, number>
export type MenuBadgeItem = Readonly<{ path: string; count: number }>

export type MenuExpand = MenuCategoryPath[]

class ArraySet<T> {
    set: T[] = []
    equals: ArraySetEntryEquals<T>

    constructor(equals: ArraySetEntryEquals<T>) {
        this.equals = equals
    }

    init(set: T[]): void {
        set.forEach((entry) => {
            this.register(entry)
        })
    }
    register(entry: T): void {
        if (this.hasEntry(entry)) {
            return
        }
        this.set.push(entry)
    }
    hasEntry(entry: T): boolean {
        return this.set.some((value) => this.equals(entry, value))
    }
}
interface ArraySetEntryEquals<T> {
    (a: T, b: T): boolean
}

export class MenuCategoryPathSet extends ArraySet<MenuCategoryPath> {
    constructor() {
        super((a, b) => {
            if (a.length !== b.length) {
                return false
            }
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) {
                    return false
                }
            }
            return true
        })
    }
}

export type MenuExpandRepositoryPod = RepositoryPod<MenuExpand, MenuExpandRepositoryValue>
export type MenuExpandRepositoryValue = string[][]

export function toMenuCategory(category: MenuTreeCategory): MenuCategory {
    return {
        label: markMenuCategoryLabel(category.label),
    }
}
export function appendMenuCategoryPath(
    path: MenuCategoryPath,
    category: MenuTreeCategory,
): MenuCategoryPath {
    return [...path, markMenuCategoryLabel(category.label)]
}
export function toMenuItem({ label, icon, path }: MenuTreeItem, version: string): MenuItem {
    return { label, icon, href: `/${version}${path}` } as MenuItem
}
export function toMenuPath(item: MenuItem, version: string): string {
    return item.href.replace(`/${version}`, "")
}

function markMenuCategoryLabel(label: string): MenuCategoryLabel {
    return label as MenuCategoryLabel
}
