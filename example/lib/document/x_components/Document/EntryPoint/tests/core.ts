import { initTestNotifyAction } from "../../../../../availability/error/notify/tests/notify"
import { initTestMenuAction } from "../../../../../auth/permission/menu/tests/menu"

import { detectMenuTarget } from "../../../../../auth/permission/menu/impl/location"
import { detectContentPath } from "../../../../content/impl/location"

import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { initNotifyComponent } from "../../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initBreadcrumbListComponent } from "../../../../../auth/z_EntryPoint/Outline/breadcrumbList/impl"
import { initMenuListComponent } from "../../../../../auth/z_EntryPoint/Outline/menuList/impl"
import { initContentComponent } from "../../content/impl"

import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../../auth/permission/menu/infra"

import { DocumentResource } from "../entryPoint"
import { initTestContentAction } from "../../../../content/tests/content"
import { ApiCredentialRepository } from "../../../../../common/auth/apiCredential/infra"

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
            menu: initTestMenuAction(
                repository.apiCredentials,
                menuTree,
                repository.menuExpands,
                remote.loadMenuBadge
            ),
            content: initTestContentAction(),
        },
        components: {
            error: initNotifyComponent,
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
