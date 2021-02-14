import { StaticMenuPath } from "../../../../y_environment/path"

import { Icon, iconClass } from "../../../../z_vendor/icon"

import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuPermission,
    MenuTree,
    MenuTreeNode,
} from "../infra"

import { MenuActionPod } from "../action"
import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import { initMenuActionPod } from "../impl"

export function newMenuActionPod(
    webStorage: Storage,
    newMenuExpandRepository: { (webStorage: Storage): MenuExpandRepository },
    menuTree: MenuTree,
    loadMenuBadge: LoadMenuBadgeRemoteAccess
): MenuActionPod {
    return initMenuActionPod({
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
