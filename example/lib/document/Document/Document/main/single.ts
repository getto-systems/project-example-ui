import { env } from "../../../../y_static/env"

import { detectMenuTarget } from "../../../../auth/Outline/Menu/impl/location"
import { detectContentPath } from "../impl/location"

import { initMenuListComponent } from "../../../../auth/Outline/menuList/impl"
import { initBreadcrumbListComponent } from "../../../../auth/Outline/breadcrumbList/impl"
import { initContentComponent } from "../../content/impl"

import { loadApiNonce, loadApiRoles } from "../../../../auth/common/credential/impl/core"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../../../auth/permission/menu/impl/core"
import { documentMenuTree } from "../../../../auth/Outline/Menu/main/menuTree"
import { loadContent } from "../../../content/impl/core"
import { DocumentCollector, DocumentFactory, initDocumentResource } from "../impl/core"

import { initMemoryApiCredentialRepository } from "../../../../auth/common/credential/impl/repository/apiCredential/memory"
import { initNoopBadgeClient } from "../../../../auth/permission/menu/impl/client/menuBadge/noop"
import { initStorageMenuExpandRepository } from "../../../../auth/permission/menu/impl/repository/menuExpand/storage"

import { DocumentEntryPoint } from "../view"

import { markApiNonce, markApiRoles } from "../../../../auth/common/credential/data"
import { CredentialAction } from "../../../../auth/common/credential/action"
import { MenuAction } from "../../../../auth/permission/menu/action"
import { ContentAction } from "../../../content/action"

export function newDocumentAsSingle(): DocumentEntryPoint {
    const menuExpandStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: DocumentFactory = {
        actions: {
            credential: initCredentialAction(),
            menu: initMenuAction(menuExpandStorage),
            content: initContentAction(),
        },
        components: {
            menuList: initMenuListComponent,
            breadcrumbList: initBreadcrumbListComponent,

            content: initContentComponent,
        },
    }
    const collector: DocumentCollector = {
        menu: {
            getMenuTarget: () => detectMenuTarget(env.version, currentURL),
        },
        content: {
            getContentPath: () => detectContentPath(env.version, currentURL),
        },
    }
    return {
        resource: initDocumentResource(factory, collector),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}

function initCredentialAction(): CredentialAction {
    const apiCredentials = initMemoryApiCredentialRepository(
        markApiNonce("api-nonce"),
        markApiRoles(["development-docs"])
    )

    return {
        loadApiNonce: loadApiNonce({ apiCredentials }),
        loadApiRoles: loadApiRoles({ apiCredentials }),
    }
}
function initMenuAction(menuExpandStorage: Storage): MenuAction {
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
function initContentAction(): ContentAction {
    return {
        loadContent: loadContent(),
    }
}
