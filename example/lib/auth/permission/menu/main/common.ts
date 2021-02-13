import { StaticMenuPath } from "../../../../y_environment/path"

import { Icon, iconClass } from "../../../../z_vendor/icon"

import { initWebTypedStorage } from "../../../../z_infra/storage/webStorage"

import { initMenuExpandConverter } from "../impl/repository/converter"
import { initMenuExpandRepository } from "../impl/repository/menuExpand"

import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../impl/core"

import { LoadMenuBadgeRemoteAccess, MenuPermission, MenuTree, MenuTreeNode } from "../infra"

import { MenuAction } from "../action"
import { newApiCredentialRepository } from "../../../../common/auth/apiCredential/infra/repository/main"

export function initMenuAction(
    menuTree: MenuTree,
    menuExpandStorage: Storage,
    storageKey: string,
    loadMenuBadge: LoadMenuBadgeRemoteAccess
): MenuAction {
    const apiCredentials = newApiCredentialRepository(menuExpandStorage)
    const menuExpands = initMenuExpandRepository({
        menuExpand: initWebTypedStorage(menuExpandStorage, storageKey, initMenuExpandConverter()),
    })

    return {
        loadBreadcrumb: loadBreadcrumb({ menuTree }),
        loadMenu: loadMenu({ menuTree, loadMenuBadge: loadMenuBadge, menuExpands, apiCredentials }),
        toggleMenuExpand: toggleMenuExpand({ menuExpands }),
    }
}

export function category(label: string, permission: MenuPermission, children: MenuTree): MenuTreeNode {
    return { type: "category", category: { label, permission }, children }
}

export function item(label: string, icon: Icon, path: StaticMenuPath): MenuTreeNode {
    return { type: "item", item: { label, icon: iconClass(icon), path } }
}
