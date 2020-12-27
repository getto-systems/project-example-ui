import { env } from "../../../../y_static/env"

import { detectMenuTarget } from "../../../../example/Outline/Menu/impl/location"
import { detectContentPath } from "../impl/location"

import { initMenuListComponent } from "../../../../example/Outline/menuList/impl"
import { initBreadcrumbListComponent } from "../../../../example/Outline/breadcrumbList/impl"
import { initContentComponent } from "../../content/impl"

import { loadApiNonce, loadApiRoles } from "../../../../example/shared/credential/impl/core"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../../../example/shared/menu/impl/core"
import { documentMenuTree } from "../../../../example/shared/menu/impl/menuTree"
import { loadDocument } from "../../../content/impl/core"
import { initDocumentComponent } from "../impl/core"

import { initMemoryApiCredentialRepository } from "../../../../example/shared/credential/impl/repository/apiCredential/memory"
import { initNoopBadgeClient } from "../../../../example/shared/menu/impl/client/menuBadge/noop"
import { initStorageMenuExpandRepository } from "../../../../example/shared/menu/impl/repository/menuExpand/storage"

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
            menu: initMenuListComponent,
            breadcrumb: initBreadcrumbListComponent,

            content: initContentComponent,
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
    const menuTree = documentMenuTree()
    const menuBadge = initNoopBadgeClient()
    const menuExpands = initStorageMenuExpandRepository(
        menuExpandStorage,
        env.storageKey.menuExpand.document
    )

    return {
        loadBreadcrumb: loadBreadcrumb({ menuTree: menuTree }),
        loadMenu: loadMenu({ menuTree: menuTree, menuBadge, menuExpands: menuExpands }),
        toggleMenuExpand: toggleMenuExpand({ menuExpands: menuExpands }),
    }
}
function initContentAction() {
    return {
        loadDocument: loadDocument(),
    }
}
