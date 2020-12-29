import { initCredentialAction, initMenuAction,  } from "../../../../auth/Outline/Menu/tests/core"

import { detectMenuTarget } from "../../../../auth/Outline/Menu/impl/location"
import { MenuBadgeSimulator } from "../../../../auth/permission/menu/impl/client/menuBadge/simulate"

import { DocumentCollector, DocumentFactory, initDocumentResource } from "../impl/core"

import { initBreadcrumbListComponent } from "../../../../auth/Outline/breadcrumbList/impl"
import { initMenuListComponent } from "../../../../auth/Outline/menuList/impl"
import { initContentComponent } from "../../content/impl"

import { ApiCredentialRepository } from "../../../../auth/common/credential/infra"
import { MenuExpandRepository, MenuTree } from "../../../../auth/permission/menu/infra"

import { DocumentResource } from "../view"
import { ContentAction } from "../../../content/action"
import { loadContent } from "../../../content/impl/core"
import { detectContentPath } from "../impl/location"

export type DocumentRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    menuExpands: MenuExpandRepository
}>
export type DocumentSimulator = Readonly<{
    menuBadge: MenuBadgeSimulator
}>
export function newDocumentResource(
    version: string,
    currentURL: URL,
    menuTree: MenuTree,
    repository: DocumentRepository,
    simulator: DocumentSimulator
): DocumentResource {
    const factory: DocumentFactory = {
        actions: {
            credential: initCredentialAction(repository.apiCredentials),
            menu: initMenuAction(menuTree, repository.menuExpands, simulator.menuBadge),
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
            getMenuTarget: () => detectMenuTarget(version, currentURL),
        },
        content: {
            getContentPath: () => detectContentPath(version, currentURL),
        },
    }

    return initDocumentResource(factory, collector)
}

function initContentAction(): ContentAction {
    return {
        loadContent: loadContent(),
    }
}
