import { env } from "../../../../y_environment/env"

import { initWebTypedStorage } from "../../../../z_infra/storage/webStorage"

import { initApiCredentialRepository } from "../../../common/credential/impl/repository/apiCredential"
import { initApiCredentialConverter } from "../../../common/credential/impl/repository/converter"
import { initStaticMenuBadgeClient } from "../../../permission/menu/impl/remote/menuBadge/static"
import { initMenuExpandRepository } from "../../../permission/menu/impl/repository/menuExpand"
import { initMenuExpandConverter } from "../../../permission/menu/impl/repository/converter"
import { documentMenuTree, mainMenuTree } from "../impl/menu/menuTree"
import { initNoopMenuBadgeClient } from "../../../permission/menu/impl/remote/menuBadge/noop"

import { loadApiNonce, loadApiRoles } from "../../../common/credential/impl/core"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../../permission/menu/impl/core"

import { MenuBadgeClient, MenuTree } from "../../../permission/menu/infra"

import { CredentialAction } from "../../../common/credential/action"
import { MenuAction } from "../../../permission/menu/action"

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
    const menuExpands = initMenuExpandRepository({
        menuExpand: initWebTypedStorage(
            menuExpandStorage,
            env.storageKey.menuExpand.main,
            initMenuExpandConverter()
        ),
    })

    return {
        loadBreadcrumb: loadBreadcrumb({ menuTree }),
        loadMenu: loadMenu({ menuTree, menuBadge, menuExpands }),
        toggleMenuExpand: toggleMenuExpand({ menuExpands }),
    }
}
