import { env } from "../../../../y_static/env"

import { detectMenuTarget } from "../../../../example/Outline/Menu/impl/location"
import { detectContentPath } from "../impl/location"

import { initMenu } from "../../../../example/Outline/menuList/impl"
import { initBreadcrumb } from "../../../../example/Outline/breadcrumbList/impl"
import { initContent } from "../../content/impl"

import { loadApiNonce, loadApiRoles } from "../../../../example/shared/credential/impl/core"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../../../example/shared/menu/impl/core"
import { documentMenuTree } from "../../../../example/shared/menu/impl/tree"
import { loadDocument } from "../../../content/impl/core"
import { initDocumentComponent } from "../impl/core"

import { initMemoryApiCredentialRepository } from "../../../../example/shared/credential/impl/repository/apiCredential/memory"
import { initNoopBadgeClient } from "../../../../example/shared/menu/impl/client/badge/noop"
import { initStorageMenuExpandRepository } from "../../../../example/shared/menu/impl/repository/expand/storage"

import { DocumentEntryPoint } from "../view"

import { markApiNonce, markApiRoles } from "../../../../example/shared/credential/data"

export function newDocumentAsSingle(): DocumentEntryPoint {
    const menuExpandStorage = localStorage
    const currentLocation = location

    const factory = {
        actions: {
            credential: initCredentialAction(),
            menu: initMenuAction(menuExpandStorage),
            content: initContentAction(),
        },
        components: {
            menu: initMenu,
            breadcrumb: initBreadcrumb,

            content: initContent,
        },
    }
    const collector = {
        menu: {
            getMenuTarget: () => detectMenuTarget(env.version, currentLocation),
        },
        content: {
            getContentPath: () => detectContentPath(env.version, currentLocation),
        },
    }
    return {
        resource: initDocumentComponent(factory, collector),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}

function initCredentialAction() {
    const apiCredentials = initMemoryApiCredentialRepository(
        markApiNonce("api-nonce"),
        markApiRoles(["development-docs"])
    )

    return {
        loadApiNonce: loadApiNonce({ apiCredentials }),
        loadApiRoles: loadApiRoles({ apiCredentials }),
    }
}
function initMenuAction(menuExpandStorage: Storage) {
    const tree = documentMenuTree()
    const badge = initNoopBadgeClient()
    const expands = initStorageMenuExpandRepository(
        menuExpandStorage,
        env.storageKey.menuExpand.document
    )

    return {
        loadBreadcrumb: loadBreadcrumb({ tree }),
        loadMenu: loadMenu({ tree, badge, expands }),
        toggleMenuExpand: toggleMenuExpand({ expands }),
    }
}
function initContentAction() {
    return {
        loadDocument: loadDocument(),
    }
}
