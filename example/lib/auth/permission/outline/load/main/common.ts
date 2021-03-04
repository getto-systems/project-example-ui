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
    LoadOutlineMenuLocationDetecter,
    LoadOutlineBreadcrumbListAction,
    LoadOutlineMenuAction,
} from "../action"
import { initOutlineMenuAction, initOutlineBreadcrumbListAction } from "../impl"
import { newLoadOutlineMenuLocationDetecter } from "../init"

export function newOutlineBreadcrumbListAction(
    currentLocation: Location,
    menuTree: OutlineMenuTree,
): LoadOutlineBreadcrumbListAction {
    return initOutlineBreadcrumbListAction(newLocationDetecter(currentLocation), {
        version: env.version,
        menuTree,
    })
}

export function newOutlineMenuAction(
    webStorage: Storage,
    currentLocation: Location,
    menuExpandRepositoryPod: OutlineMenuExpandRepositoryPod,
    menuTree: OutlineMenuTree,
    loadMenuBadge: LoadOutlineMenuBadgeRemotePod,
): LoadOutlineMenuAction {
    return initOutlineMenuAction(newLocationDetecter(currentLocation), {
        version: env.version,
        loadMenuBadge,
        authz: newAuthzRepository(webStorage),
        menuExpands: menuExpandRepositoryPod,
        menuTree,
    })
}

function newLocationDetecter(currentLocation: Location): LoadOutlineMenuLocationDetecter {
    return newLoadOutlineMenuLocationDetecter(currentLocation)
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
