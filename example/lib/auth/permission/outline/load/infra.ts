import {
    Remote,
    RemoteResult,
    RemoteSimulator,
} from "../../../../z_getto/remote/infra"
import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"

import { ApiNonce } from "../../../../common/apiCredential/data"
import { LoadOutlineMenuBadgeRemoteError, OutlineMenuCategoryPath } from "./data"
import {
    LoadOutlineBreadcrumbListPod,
    LoadOutlineMenuPod,
    ToggleOutlineMenuExpandMethod,
} from "./action"
import { StoreResult } from "../../../../z_getto/storage/infra"
import { StorageError } from "../../../../z_getto/storage/data"

export type OutlineBreadcrumbListActionInfra = LoadOutlineBreadcrumbListInfra
export type OutlineMenuActionInfra = LoadOutlineMenuInfra & ToggleOutlineMenuExpandInfra

export type LoadOutlineBreadcrumbListInfra = Readonly<{
    menuTree: OutlineMenuTree
}>

export interface LoadOutlineBreadcrumbList {
    (infra: LoadOutlineBreadcrumbListInfra): LoadOutlineBreadcrumbListPod
}

export type LoadOutlineMenuInfra = Readonly<{
    loadMenuBadge: LoadOutlineMenuBadgeRemoteAccess
    apiCredentials: ApiCredentialRepository
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

export type LoadOutlineMenuBadgeRemoteAccess = Remote<
    ApiNonce,
    OutlineMenuBadge,
    LoadOutlineMenuBadgeRemoteError
>
export type LoadOutlineMenuBadgeRemoteAccessResult = RemoteResult<
    OutlineMenuBadge,
    LoadOutlineMenuBadgeRemoteError
>
export type LoadOutlineMenuBadgeSimulator = RemoteSimulator<
    ApiNonce,
    OutlineMenuBadge,
    LoadOutlineMenuBadgeRemoteError
>
