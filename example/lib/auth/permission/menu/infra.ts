import { ApiNonce } from "../../common/credential/data"
import { MenuCategoryPath } from "./data"

export type LoadBreadcrumbInfra = Readonly<{
    menuTree: MenuTree
}>

export type LoadMenuInfra = Readonly<{
    menuTree: MenuTree
    menuExpands: MenuExpandRepository
    menuBadge: MenuBadgeClient
}>

export type ToggleMenuExpandInfra = Readonly<{
    menuExpands: MenuExpandRepository
}>

export type MenuTreeLabel = string
export type MenuPath = string

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

export type MenuPermission = Readonly<{ type: "any" }> | Readonly<{ type: "role"; roles: string[] }>

export type MenuBadge = Record<string, number>
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

export interface MenuExpandRepository {
    findMenuExpand(): MenuExpandResponse
    saveMenuExpand(menuExpand: MenuExpand): ToggleExpandResponse
}

export type MenuExpandResponse =
    | Readonly<{ success: true; menuExpand: MenuExpand }>
    | Readonly<{ success: false; err: MenuExpandError }>

export type ToggleExpandResponse =
    | Readonly<{ success: true }>
    | Readonly<{ success: false; err: ToggleExpandError }>

export type MenuExpandError = Readonly<{ type: "infra-error"; err: string }>
export type ToggleExpandError = Readonly<{ type: "infra-error"; err: string }>

export interface MenuBadgeClient {
    getBadge(apiNonce: ApiNonce): Promise<MenuBadgeResponse>
}

export type MenuBadgeResponse =
    | Readonly<{ success: true; menuBadge: MenuBadge }>
    | Readonly<{ success: false; err: MenuBadgeError }>

export type MenuBadgeError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
