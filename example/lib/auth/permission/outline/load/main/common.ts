import { env } from "../../../../../y_environment/env"
import { StaticMenuPath } from "../../../../../y_environment/path"

import { currentURL } from "../../../../../z_getto/infra/location/url"

import { Icon, iconClass } from "../../../../../z_vendor/icon/core"

import {
    LoadOutlineMenuBadgeRemoteAccess,
    OutlineMenuExpandRepository,
    OutlineMenuPermission,
    OutlineMenuTree,
    OutlineMenuTreeNode,
} from "../infra"

import { LoadOutlineActionLocationInfo, LoadOutlineBreadcrumbListAction, LoadOutlineMenuAction } from "../action"
import { newApiCredentialRepository } from "../../../../../common/apiCredential/infra/repository/main"
import {
    initOutlineMenuAction,
    initOutlineActionLocationInfo,
    initOutlineBreadcrumbListAction,
} from "../impl"

export function newOutlineBreadcrumbListAction(menuTree: OutlineMenuTree): LoadOutlineBreadcrumbListAction {
    return initOutlineBreadcrumbListAction(newLocationInfo(), {
        menuTree,
    })
}

export function newOutlineMenuAction(
    webStorage: Storage,
    newMenuExpandRepository: { (webStorage: Storage): OutlineMenuExpandRepository },
    menuTree: OutlineMenuTree,
    loadMenuBadge: LoadOutlineMenuBadgeRemoteAccess
): LoadOutlineMenuAction {
    return initOutlineMenuAction(newLocationInfo(), {
        loadMenuBadge,
        apiCredentials: newApiCredentialRepository(webStorage),
        menuExpands: newMenuExpandRepository(webStorage),
        menuTree,
    })
}

function newLocationInfo(): LoadOutlineActionLocationInfo {
    return initOutlineActionLocationInfo(env.version, currentURL())
}

export function category(
    label: string,
    permission: OutlineMenuPermission,
    children: OutlineMenuTree
): OutlineMenuTreeNode {
    return { type: "category", category: { label, permission }, children }
}

export function item(label: string, icon: Icon, path: StaticMenuPath): OutlineMenuTreeNode {
    return { type: "item", item: { label, icon: iconClass(icon), path } }
}
