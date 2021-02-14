import { RemoteAccess, RemoteAccessResult, RemoteAccessSimulator } from "../../../z_infra/remote/infra"
import { ApiCredentialRepository } from "../../../common/apiCredential/infra"

import { ApiNonce } from "../../../common/apiCredential/data"
import { LoadMenuBadgeRemoteError, MenuCategoryPath } from "./data"
import { LoadBreadcrumbListPod, LoadMenuPod, ToggleMenuExpandPod } from "./action"
import { StoreResult } from "../../../common/storage/infra"
import { StorageError } from "../../../common/storage/data"

export type BreadcrumbListActionInfra = LoadBreadcrumbListInfra
export type MenuActionInfra = LoadMenuInfra & ToggleMenuExpandInfra

export type LoadBreadcrumbListInfra = Readonly<{
    menuTree: MenuTree
}>

export interface LoadBreadcrumbList {
    (infra: LoadBreadcrumbListInfra): LoadBreadcrumbListPod
}

export type LoadMenuInfra = Readonly<{
    loadMenuBadge: LoadMenuBadgeRemoteAccess
    apiCredentials: ApiCredentialRepository
    menuExpands: MenuExpandRepository
    menuTree: MenuTree
}>

export interface LoadMenu {
    (infra: LoadMenuInfra): LoadMenuPod
}

export type ToggleMenuExpandInfra = Readonly<{
    menuExpands: MenuExpandRepository
}>

export interface ToggleMenuExpand {
    (infra: ToggleMenuExpandInfra): ToggleMenuExpandPod
}

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
    load(): MenuExpandResponse
    store(menuExpand: MenuExpand): StoreResult
}

export type MenuExpandResponse =
    | Readonly<{ success: true; menuExpand: MenuExpand }>
    | Readonly<{ success: false; err: StorageError }>

export type LoadMenuBadgeRemoteAccess = RemoteAccess<ApiNonce, MenuBadge, LoadMenuBadgeRemoteError>
export type LoadMenuBadgeRemoteAccessResult = RemoteAccessResult<MenuBadge, LoadMenuBadgeRemoteError>
export type LoadMenuBadgeSimulator = RemoteAccessSimulator<ApiNonce, MenuBadge, LoadMenuBadgeRemoteError>
