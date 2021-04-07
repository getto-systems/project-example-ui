import { RemoteTypes } from "../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryPod } from "../../z_vendor/getto-application/infra/repository/infra"

import { GetMenuBadgeRemoteError, MenuCategoryPath } from "./data"

export type MenuContent = Readonly<{
    database: string
    key: string
    loadMenuBadge: boolean
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

export type MenuBadgeStore = MenuStore<MenuBadge>
export type MenuExpandStore = MenuStore<MenuExpand>

export interface MenuStore<T> {
    get(): FetchMenuStoreResult<T>
    set(value: T): void
}
export type FetchMenuStoreResult<T> =
    | Readonly<{ found: true; value: T }>
    | Readonly<{ found: false }>

type GetMenuBadgeRemoteTypes = RemoteTypes<
    { type: "always" }, // 引数は必要ないが、null にするのは嫌なのでこうしておく
    MenuBadge,
    MenuBadgeItem[],
    GetMenuBadgeRemoteError
>
export type GetMenuBadgeRemotePod = GetMenuBadgeRemoteTypes["pod"]
export type GetMenuBadgeRemoteResult = GetMenuBadgeRemoteTypes["result"]
export type GetMenuBadgeSimulator = GetMenuBadgeRemoteTypes["simulator"]

export type MenuBadge = Map<string, number>
export type MenuBadgeItem = Readonly<{ path: string; count: number }>

export type MenuExpand = ArraySet<MenuCategoryPath>

export type MenuExpandRepositoryPod = RepositoryPod<MenuExpand, MenuExpandRepositoryValue>
export type MenuExpandRepositoryValue = string[][]

class ArraySet<T> {
    values: T[] = []
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
        this.values = [...this.values, entry]
    }
    remove(entry: T): void {
        this.values = this.values.filter((value) => !this.equals(entry, value))
    }
    hasEntry(entry: T): boolean {
        return this.values.some((value) => this.equals(entry, value))
    }
}
interface ArraySetEntryEquals<T> {
    (a: T, b: T): boolean
}

export function initMenuExpand(): MenuExpand {
    return new ArraySet<MenuCategoryPath>((a, b) => {
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
