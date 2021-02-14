import { initTestNotifyAction } from "../../../../../availability/error/notify/tests/notify"

import {
    detectMenuTarget,
    initBreadcrumbListActionPod,
    initMenuActionPod,
} from "../../../../../auth/permission/menu/impl"
import { detectContentPath } from "../../../../content/impl/location"

import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { initNotifyComponent } from "../../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initContentComponent } from "../../content/impl"

import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../../auth/permission/menu/infra"

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
    const factory: DocumentFactory = {
        actions: {
            initBreadcrumbList: initBreadcrumbListActionPod({ menuTree }),
            initMenu: initMenuActionPod({
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
    const locationInfo: DocumentLocationInfo = {
        getMenuTarget: () => detectMenuTarget(version, currentURL),
        content: {
            getContentPath: () => detectContentPath(version, currentURL),
        },
    }

    return initDocumentResource(factory, locationInfo)
}
