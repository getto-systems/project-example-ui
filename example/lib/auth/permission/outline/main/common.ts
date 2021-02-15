import { env } from "../../../../y_environment/env"
import { StaticMenuPath } from "../../../../y_environment/path"

import { currentURL } from "../../../../z_infra/location/url"

import { Icon, iconClass } from "../../../../z_vendor/icon"

import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuPermission,
    MenuTree,
    MenuTreeNode,
} from "../infra"

import { OutlineActionLocationInfo, MenuAction } from "../action"
import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import { initMenuAction, initOutlineActionLocationInfo } from "../impl"

export function newOutlineActionLocationInfo(): OutlineActionLocationInfo {
    return initOutlineActionLocationInfo(env.version, currentURL())
}

export function newMenuAction(
    webStorage: Storage,
    newMenuExpandRepository: { (webStorage: Storage): MenuExpandRepository },
    menuTree: MenuTree,
    loadMenuBadge: LoadMenuBadgeRemoteAccess
): MenuAction {
    return initMenuAction(newOutlineActionLocationInfo(), {
        loadMenuBadge,
        apiCredentials: newApiCredentialRepository(webStorage),
        menuExpands: newMenuExpandRepository(webStorage),
        menuTree,
    })
}

export function category(label: string, permission: MenuPermission, children: MenuTree): MenuTreeNode {
    return { type: "category", category: { label, permission }, children }
}

export function item(label: string, icon: Icon, path: StaticMenuPath): MenuTreeNode {
    return { type: "item", item: { label, icon: iconClass(icon), path } }
}
