import { RemoteTypes } from "../../../../z_vendor/getto-application/infra/remote/infra"

import {
    StorageError,
    StoreResult,
} from "../../../../z_vendor/getto-application/infra/storage/data"
import { AuthzRepositoryPod } from "../../../../common/authz/infra"

import {
    LoadOutlineBreadcrumbListPod,
    LoadOutlineMenuPod,
    ToggleOutlineMenuExpandMethod,
} from "./action"

import { AuthzNonce } from "../../../../common/authz/data"
import { LoadOutlineMenuBadgeRemoteError, OutlineMenuCategoryPath } from "./data"

export type OutlineBreadcrumbListActionInfra = LoadOutlineBreadcrumbListInfra
export type OutlineMenuActionInfra = LoadOutlineMenuInfra & ToggleOutlineMenuExpandInfra

export type LoadOutlineBreadcrumbListInfra = Readonly<{
    menuTree: OutlineMenuTree
}>

export interface LoadOutlineBreadcrumbList {
    (infra: LoadOutlineBreadcrumbListInfra): LoadOutlineBreadcrumbListPod
}

export type LoadOutlineMenuInfra = Readonly<{
    loadMenuBadge: LoadOutlineMenuBadgeRemotePod
    authz: AuthzRepositoryPod
    menuExpands: OutlineMenuExpandRepository
    menuTree: OutlineMenuTree
}>

export interface LoadOutlineMenu {
    (infra: LoadOutlineMenuInfra): LoadOutlineMenuPod
}

export type ToggleOutlineMenuExpandInfra = Readonly<{
    menuExpands: OutlineMenuExpandRepository
}>

export interface ToggleOutlineMenuExpand {
    (infra: ToggleOutlineMenuExpandInfra): ToggleOutlineMenuExpandMethod
}

export type OutlineMenuTreeLabel = string
export type OutlineMenuPath = string

export type OutlineMenuTree = OutlineMenuTreeNode[]
export type OutlineMenuTreeNode =
    | Readonly<{ type: "category"; category: OutlineMenuTreeCategory; children: OutlineMenuTree }>
    | Readonly<{ type: "item"; item: OutlineMenuTreeItem }>

export type OutlineMenuTreeCategory = Readonly<{
    label: OutlineMenuTreeLabel
    permission: OutlineMenuPermission
}>
export type OutlineMenuTreeItem = Readonly<{
    path: OutlineMenuPath
    label: string
    icon: string
}>

export type OutlineMenuPermission =
    | Readonly<{ type: "allow" }>
    | Readonly<{ type: "any"; permits: OutlineMenuPermission[] }>
    | Readonly<{ type: "all"; permits: OutlineMenuPermission[] }>
    | Readonly<{ type: "role"; role: string }>

export type OutlineMenuBadge = Record<string, number>
export type OutlineMenuExpand = OutlineMenuCategoryPath[]

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

export class OutlineMenuCategoryPathSet extends ArraySet<OutlineMenuCategoryPath> {
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

export interface OutlineMenuExpandRepository {
    load(): OutlineMenuExpandResponse
    store(menuExpand: OutlineMenuExpand): StoreResult
}

export type OutlineMenuExpandResponse =
    | Readonly<{ success: true; menuExpand: OutlineMenuExpand }>
    | Readonly<{ success: false; err: StorageError }>

type LoadOutlineMenuBadgeRemoteTypes = RemoteTypes<
    AuthzNonce,
    OutlineMenuBadgeItem[],
    OutlineMenuBadgeItem[],
    LoadOutlineMenuBadgeRemoteError
>
export type LoadOutlineMenuBadgeRemotePod = LoadOutlineMenuBadgeRemoteTypes["pod"]
export type LoadOutlineMenuBadgeRemoteResult = LoadOutlineMenuBadgeRemoteTypes["result"]
export type LoadOutlineMenuBadgeSimulator = LoadOutlineMenuBadgeRemoteTypes["simulator"]

export type OutlineMenuBadgeItem = Readonly<{ path: string; count: number }>
