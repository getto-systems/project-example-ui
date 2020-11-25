import { ApiNonce } from "../credential/data"

export type LoadBreadcrumbInfra = Readonly<{
    tree: MenuTree
}>

export type LoadMenuInfra = Readonly<{
    tree: MenuTree
    expands: MenuExpandRepository
    badge: MenuBadgeClient
}>

export type ToggleMenuExpandInfra = Readonly<{
    expands: MenuExpandRepository
}>

export type MenuCategoryLabel = string
export type MenuPath = string

export type MenuTree = MenuTreeNode[]
export type MenuTreeNode =
    | Readonly<{ type: "category"; category: MenuTreeCategory; children: MenuTree }>
    | Readonly<{ type: "item"; item: MenuTreeItem }>

export type MenuTreeCategory = Readonly<{
    label: MenuCategoryLabel
    permission: MenuPermission
}>
export type MenuTreeItem = Readonly<{
    path: MenuPath
    label: string
    icon: string
}>

export type MenuPermission = Readonly<{ type: "any" }> | Readonly<{ type: "role"; roles: string[] }>

export type MenuBadge = Record<MenuPath, number>
export type MenuExpand = CategoryLabelsArraySet

class ArraySet<T> {
    set: T[] = []
    equals: ArraySetEntryEquals<T>

    constructor(equals: ArraySetEntryEquals<T>) {
        this.equals = equals
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
    remove(entry: T): void {
        this.set = this.set.filter((value) => !this.equals(entry, value))
    }
}
interface ArraySetEntryEquals<T> {
    (a: T, b: T): boolean
}

export class CategoryLabelsArraySet extends ArraySet<string[]> {
    constructor() {
        super((a: string[], b: string[]): boolean => {
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
    findExpand(): MenuExpandResponse
    clearExpand(category: string[]): ToggleExpandResponse
    setExpand(category: string[]): ToggleExpandResponse
}

export type MenuExpandResponse =
    | Readonly<{ success: true; expand: MenuExpand }>
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
    | Readonly<{ success: true; badge: MenuBadge }>
    | Readonly<{ success: false; err: MenuBadgeError }>

export type MenuBadgeError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
