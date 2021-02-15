import {
    initBreadcrumbListAction,
    initMenuAction,
    initOutlineActionLocationInfo,
} from "../../../../../auth/permission/outline/impl"
import { detectContentPath } from "../../../../content/impl/location"

import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { initContentComponent } from "../../content/impl"

import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../../auth/permission/outline/infra"

import { DocumentResource } from "../entryPoint"
import { initTestContentAction } from "../../../../content/tests/content"
import { ApiCredentialRepository } from "../../../../../common/apiCredential/infra"
import { initNotifySimulateRemoteAccess } from "../../../../../availability/error/infra/remote/notify/simulate"
import { initErrorAction } from "../../../../../availability/error/impl"

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
            error: initErrorAction({
                notify: initNotifySimulateRemoteAccess(),
            }),
            breadcrumbList: initBreadcrumbListAction(locationInfo, { menuTree }),
            menu: initMenuAction(locationInfo, {
                ...repository,
                ...remote,
                menuTree,
            }),

            content: initTestContentAction(),
        },
        components: {
            content: initContentComponent,
        },
    }

    return initDocumentResource(factory, locationInfo)
}
