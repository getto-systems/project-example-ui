import { initTestNotifyAction } from "../../../../../available/notify/tests/notify"
import { initTestCredentialAction } from "../../../../../auth/common/credential/tests/credential"
import { initTestMenuAction } from "../../../../../auth/permission/menu/tests/menu"

import { detectMenuTarget } from "../../../../../auth/permission/menu/impl/location"
import { detectContentPath } from "../../../../content/impl/location"

import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { initErrorComponent } from "../../../../../available/x_components/Error/error/impl"
import { initBreadcrumbListComponent } from "../../../../../auth/z_EntryPoint/Outline/breadcrumbList/impl"
import { initMenuListComponent } from "../../../../../auth/z_EntryPoint/Outline/menuList/impl"
import { initContentComponent } from "../../content/impl"

import { ApiCredentialRepository } from "../../../../../auth/common/credential/infra"
import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../../auth/permission/menu/infra"

import { DocumentResource } from "../entryPoint"
import { initTestContentAction } from "../../../../content/tests/content"

export type DocumentRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    menuExpands: MenuExpandRepository
}>
export type DocumentRemoteAccess = Readonly<{
    loadMenuBadge: LoadMenuBadgeRemoteAccess
}>
export function newTestDocumentResource(
    version: string,
    currentURL: URL,
    menuTree: MenuTree,
    repository: DocumentRepository,
    remote: DocumentRemoteAccess
): DocumentResource {
    const factory: DocumentFactory = {
        actions: {
            notify: initTestNotifyAction(),
            credential: initTestCredentialAction(repository.apiCredentials),
            menu: initTestMenuAction(menuTree, repository.menuExpands, remote.loadMenuBadge),
            content: initTestContentAction(),
        },
        components: {
            error: initErrorComponent,
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
