import { initCredentialAction, initMenuAction } from "../../../../../auth/x_components/Outline/Menu/tests/core"

import { detectMenuTarget } from "../../../../../auth/x_components/Outline/Menu/impl/location"
import { detectContentPath } from "../impl/location"

import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"
import { loadContent } from "../../../../content/impl/core"

import { initBreadcrumbListComponent } from "../../../../../auth/x_components/Outline/breadcrumbList/impl"
import { initMenuListComponent } from "../../../../../auth/x_components/Outline/menuList/impl"
import { initContentComponent } from "../../content/impl"

import { ApiCredentialRepository } from "../../../../../auth/common/credential/infra"
import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../../auth/permission/menu/infra"

import { DocumentResource } from "../entryPoint"
import { ContentAction } from "../../../../content/action"

export type DocumentRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    menuExpands: MenuExpandRepository
}>
export type DocumentRemoteAccess = Readonly<{
    loadMenuBadge: LoadMenuBadgeRemoteAccess
}>
export function newDocumentResource(
    version: string,
    currentURL: URL,
    menuTree: MenuTree,
    repository: DocumentRepository,
    remote: DocumentRemoteAccess
): DocumentResource {
    const factory: DocumentFactory = {
        actions: {
            credential: initCredentialAction(repository.apiCredentials),
            menu: initMenuAction(menuTree, repository.menuExpands, remote.loadMenuBadge),
            content: initContentAction(),
        },
        components: {
            menuList: initMenuListComponent,
            breadcrumbList: initBreadcrumbListComponent,

            content: initContentComponent,
        },
    }
    const locationInfo: DocumentLocationInfo = {
        menu: {
            getMenuTarget: () => detectMenuTarget(version, currentURL),
        },
        content: {
            getContentPath: () => detectContentPath(version, currentURL),
        },
    }

    return initDocumentResource(factory, locationInfo)
}

function initContentAction(): ContentAction {
    return {
        loadContent: loadContent(),
    }
}
