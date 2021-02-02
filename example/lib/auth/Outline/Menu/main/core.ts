import { env } from "../../../../y_static/env"

import { initMemoryApiCredentialRepository } from "../../../common/credential/impl/repository/apiCredential/memory"
import { initStaticMenuBadgeClient } from "../../../permission/menu/impl/remote/menuBadge/static"
import { initStorageMenuExpandRepository } from "../../../permission/menu/impl/repository/menuExpand/storage"
import { documentMenuTree, mainMenuTree } from "../impl/menu/menuTree"

import { loadApiNonce, loadApiRoles } from "../../../common/credential/impl/core"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../../permission/menu/impl/core"

import { CredentialAction } from "../../../common/credential/action"
import { MenuAction } from "../../../permission/menu/action"

import { markApiNonce, markApiRoles } from "../../../common/credential/data"
import { initNoopMenuBadgeClient } from "../../../permission/menu/impl/remote/menuBadge/noop"
import { MenuBadgeClient, MenuTree } from "../../../permission/menu/infra"

export function initCredentialAction(): CredentialAction {
    const apiCredentials = initMemoryApiCredentialRepository(
        markApiNonce("api-nonce"),
        markApiRoles(["admin"])
    )

    return {
        loadApiNonce: loadApiNonce({ apiCredentials }),
        loadApiRoles: loadApiRoles({ apiCredentials }),
    }
}
export function initMainMenuAction(menuExpandStorage: Storage): MenuAction {
    return initMenuAction(
        mainMenuTree(),
        menuExpandStorage,
        initStaticMenuBadgeClient({
            "/index.html": 50,
        })
    )
}
export function initDocumentMenuAction(menuExpandStorage: Storage): MenuAction {
    return initMenuAction(documentMenuTree(), menuExpandStorage, initNoopMenuBadgeClient())
}
function initMenuAction(
    menuTree: MenuTree,
    menuExpandStorage: Storage,
    menuBadge: MenuBadgeClient
): MenuAction {
    const menuExpands = initStorageMenuExpandRepository(
        menuExpandStorage,
        env.storageKey.menuExpand.main
    )

    return {
        loadBreadcrumb: loadBreadcrumb({ menuTree }),
        loadMenu: loadMenu({ menuTree, menuBadge, menuExpands }),
        toggleMenuExpand: toggleMenuExpand({ menuExpands }),
    }
}
