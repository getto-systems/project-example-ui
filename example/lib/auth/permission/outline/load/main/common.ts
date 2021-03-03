import { env } from "../../../../../y_environment/env"
import { StaticMenuPath } from "../../../../../y_environment/path"

import { Icon, iconClass } from "../../../../../z_external/icon/core"

import { newAuthzRepository } from "../../../../../common/authz/infra/repository/authz"

import {
    LoadOutlineMenuBadgeRemotePod,
    OutlineMenuExpandRepositoryPod,
    OutlineMenuPermission,
    OutlineMenuTree,
    OutlineMenuTreeNode,
} from "../infra"

import {
    LoadOutlineActionLocationInfo,
    LoadOutlineBreadcrumbListAction,
    LoadOutlineMenuAction,
} from "../action"
import {
    initOutlineMenuAction,
    initOutlineActionLocationInfo,
    initOutlineBreadcrumbListAction,
} from "../impl"

export function newOutlineBreadcrumbListAction(
    currentURL: URL,
    menuTree: OutlineMenuTree,
): LoadOutlineBreadcrumbListAction {
    return initOutlineBreadcrumbListAction(newLocationInfo(currentURL), {
        menuTree,
    })
}

export function newOutlineMenuAction(
    webStorage: Storage,
    currentURL: URL,
    menuExpandRepositoryPod: OutlineMenuExpandRepositoryPod,
    menuTree: OutlineMenuTree,
    loadMenuBadge: LoadOutlineMenuBadgeRemotePod,
): LoadOutlineMenuAction {
    return initOutlineMenuAction(newLocationInfo(currentURL), {
        loadMenuBadge,
        authz: newAuthzRepository(webStorage),
        menuExpands: menuExpandRepositoryPod,
        menuTree,
    })
}

function newLocationInfo(currentURL: URL): LoadOutlineActionLocationInfo {
    return initOutlineActionLocationInfo(env.version, currentURL)
}

export function category(
    label: string,
    permission: OutlineMenuPermission,
    children: OutlineMenuTree,
): OutlineMenuTreeNode {
    return { type: "category", category: { label, permission }, children }
}

export function item(label: string, icon: Icon, path: StaticMenuPath): OutlineMenuTreeNode {
    return { type: "item", item: { label, icon: iconClass(icon), path } }
}
