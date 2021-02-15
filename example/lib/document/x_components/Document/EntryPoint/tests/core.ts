import { initTestNotifyAction } from "../../../../../availability/error/notify/tests/notify"

import { initBreadcrumbListAction, initMenuAction, initOutlineActionLocationInfo } from "../../../../../auth/permission/outline/impl"
import { detectContentPath } from "../../../../content/impl/location"

import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { initNotifyComponent } from "../../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initContentComponent } from "../../content/impl"

import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../../auth/permission/outline/infra"

import { DocumentResource } from "../entryPoint"
import { initTestContentAction } from "../../../../content/tests/content"
import { ApiCredentialRepository } from "../../../../../common/apiCredential/infra"

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
    const locationInfo: DocumentLocationInfo = {
        ...initOutlineActionLocationInfo(version, currentURL),
        content: {
            getContentPath: () => detectContentPath(version, currentURL),
        },
    }
    const factory: DocumentFactory = {
        actions: {
            breadcrumbList: initBreadcrumbListAction(locationInfo, { menuTree }),
            menu: initMenuAction(locationInfo, {
                ...repository,
                ...remote,
                menuTree,
            }),

            notify: initTestNotifyAction(),
            content: initTestContentAction(),
        },
        components: {
            error: initNotifyComponent,
            content: initContentComponent,
        },
    }

    return initDocumentResource(factory, locationInfo)
}
