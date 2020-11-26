import { env } from "../../../y_static/env"

import { initMenu } from "../../../System/component/menu/impl"
import { initBreadcrumb } from "../../../System/component/breadcrumb/impl"
import { initContent } from "../../component/content/impl"

import { detectMenuTarget } from "../../../System/impl/menu"

import { loadApiNonce, loadApiRoles } from "../../../credential/impl/core"
import { documentMenuTree } from "../../../menu/impl/tree"

import { initDocumentFactoryAsSingle } from "../impl/single"

import { DocumentFactory } from "../view"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../../menu/impl/core"

import { initMemoryApiCredentialRepository } from "../../../credential/impl/repository/api_credential/memory"
import { initNoopBadgeClient } from "../../../menu/impl/client/badge/noop"
import { initMemoryMenuExpandRepository } from "../../../menu/impl/repository/expand/memory"
import { CategoryLabelsSet } from "../../../menu/infra"

import { markApiNonce, markApiRoles } from "../../../credential/data"

export function newDocumentComponentSetFactoryAsSingle(currentLocation: Location): DocumentFactory {
    const factory = {
        actions: {
            credential: initCredentialAction(),
            menu: initMenuAction(),
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
    }
    return initDocumentFactoryAsSingle(factory, collector)
}

function initCredentialAction() {
    const apiCredentials = initMemoryApiCredentialRepository(
        markApiNonce("api-nonce"),
        markApiRoles(["admin"])
    )

    return {
        loadApiNonce: loadApiNonce({ apiCredentials }),
        loadApiRoles: loadApiRoles({ apiCredentials }),
    }
}
function initMenuAction() {
    const tree = documentMenuTree
    const badge = initNoopBadgeClient()
    const expands = initMemoryMenuExpandRepository(new CategoryLabelsSet())

    return {
        loadBreadcrumb: loadBreadcrumb({ tree }),
        loadMenu: loadMenu({ tree, badge, expands }),
        toggleMenuExpand: toggleMenuExpand({ expands }),
    }
}
