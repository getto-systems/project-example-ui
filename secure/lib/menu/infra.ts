import { Icon } from "../z_external/icon"

import { ApiCredential } from "./action"

export type MenuInfra = Readonly<{
    info: MenuInfo
    client: Readonly<{
        expand: MenuExpandClient
        badge: MenuBadgeClient
    }>
}>

export type MenuInfo = Readonly<{
    version: string
    currentPath: MenuPath
    tree: MenuTree
}>

export type MenuCategoryLabel = string
export type MenuPath = string

export type MenuTree = MenuTreeNode[]
export type MenuTreeNode =
    | Readonly<{ type: "category"; category: MenuTreeCategory; children: MenuTree }>
    | Readonly<{ type: "item"; item: MenuTreeItem }>

export type MenuTreeCategory = Readonly<{ label: MenuCategoryLabel }>
export type MenuTreeItem = Readonly<{
    path: MenuPath
    label: string
    icon: Icon
}>

export type MenuBadge = Record<MenuPath, number>
export type MenuExpand = Record<MenuCategoryLabel, boolean>

export interface MenuExpandClient {
    getExpand(): Promise<MenuExpandResponse>
}
export interface MenuBadgeClient {
    getBadge(apiCredential: ApiCredential): Promise<MenuBadgeResponse>
}

export type MenuExpandResponse =
    | Readonly<{ success: true; expand: MenuExpand }>
    | Readonly<{ success: false; err: MenuExpandError }>

export type MenuExpandError = Readonly<{ type: "infra-error"; err: string }>

export type MenuBadgeResponse =
    | Readonly<{ success: true; badge: MenuBadge }>
    | Readonly<{ success: false; err: MenuBadgeError }>

export type MenuBadgeError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
