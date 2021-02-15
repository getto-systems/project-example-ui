import { env } from "../../../../y_environment/env"
import { StaticMenuPath } from "../../../../y_environment/path"

import { currentURL } from "../../../../z_infra/location/url"

import { Icon, iconClass } from "../../../../z_vendor/icon"

import {
    LoadOutlineMenuBadgeRemoteAccess,
    OutlineMenuExpandRepository,
    OutlineMenuPermission,
    OutlineMenuTree,
    OutlineMenuTreeNode,
} from "../infra"

import { OutlineActionLocationInfo, OutlineBreadcrumbListAction, OutlineMenuAction } from "../action"
import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import {
    initOutlineMenuAction,
    initOutlineActionLocationInfo,
    initOutlineBreadcrumbListAction,
} from "../impl"

export function newOutlineBreadcrumbListAction(menuTree: OutlineMenuTree): OutlineBreadcrumbListAction {
    return initOutlineBreadcrumbListAction(newLocationInfo(), {
        menuTree,
    })
}

export function newOutlineMenuAction(
    webStorage: Storage,
    newMenuExpandRepository: { (webStorage: Storage): OutlineMenuExpandRepository },
    menuTree: OutlineMenuTree,
    loadMenuBadge: LoadOutlineMenuBadgeRemoteAccess
): OutlineMenuAction {
    return initOutlineMenuAction(newLocationInfo(), {
        loadMenuBadge,
        apiCredentials: newApiCredentialRepository(webStorage),
        menuExpands: newMenuExpandRepository(webStorage),
        menuTree,
    })
}

function newLocationInfo(): OutlineActionLocationInfo {
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
