import { env } from "../../../../../y_environment/env"

import { initWebTypedStorage } from "../../../../../z_infra/storage/webStorage"

import { initApiCredentialRepository } from "../../../../common/credential/impl/repository/apiCredential"
import { initApiCredentialConverter } from "../../../../common/credential/impl/repository/converter"
import { initMenuExpandRepository } from "../../../../permission/menu/impl/repository/menuExpand"
import { initMenuExpandConverter } from "../../../../permission/menu/impl/repository/converter"
import { documentMenuTree, mainMenuTree } from "../impl/menu/menuTree"
import { initLoadMenuBadgeNoopRemoteAccess } from "../../../../permission/menu/impl/remote/menuBadge/noop"

import { loadApiNonce, loadApiRoles } from "../../../../common/credential/impl/core"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../../../permission/menu/impl/core"

import { LoadMenuBadgeRemoteAccess, MenuTree } from "../../../../permission/menu/infra"

import { CredentialAction } from "../../../../common/credential/action"
import { MenuAction } from "../../../../permission/menu/action"
import { initLoadMenuBadgeSimulateRemoteAccess } from "../../../../permission/menu/impl/remote/menuBadge/simulate"

export function initCredentialAction(credentialStorage: Storage): CredentialAction {
    const apiCredentials = initApiCredentialRepository({
        apiCredential: initWebTypedStorage(
            credentialStorage,
            env.storageKey.apiCredential,
            initApiCredentialConverter()
        ),
    })

    return {
        loadApiNonce: loadApiNonce({ apiCredentials }),
        loadApiRoles: loadApiRoles({ apiCredentials }),
    }
}
export function initMainMenuAction(menuExpandStorage: Storage): MenuAction {
    return initMenuAction(
        mainMenuTree(),
        menuExpandStorage,
        env.storageKey.menuExpand.main,
        initLoadMenuBadgeSimulateRemoteAccess(() => ({ success: true, value: { "/index.html": 50 } }), {
            wait_millisecond: 0,
        })
    )
}
export function initDocumentMenuAction(menuExpandStorage: Storage): MenuAction {
    return initMenuAction(
        documentMenuTree(),
        menuExpandStorage,
        env.storageKey.menuExpand.document,
        initLoadMenuBadgeNoopRemoteAccess()
    )
}
function initMenuAction(
    menuTree: MenuTree,
    menuExpandStorage: Storage,
    storageKey: string,
    loadMenuBadge: LoadMenuBadgeRemoteAccess
): MenuAction {
    const menuExpands = initMenuExpandRepository({
        menuExpand: initWebTypedStorage(
            menuExpandStorage,
            storageKey,
            initMenuExpandConverter()
        ),
    })

    return {
        loadBreadcrumb: loadBreadcrumb({ menuTree }),
        loadMenu: loadMenu({ menuTree, loadMenuBadge: loadMenuBadge, menuExpands }),
        toggleMenuExpand: toggleMenuExpand({ menuExpands }),
    }
}
