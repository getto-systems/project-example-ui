import {
    initOutlineBreadcrumbListAction,
    initOutlineMenuAction,
    initOutlineActionLocationInfo,
} from "../../../../../auth/permission/outline/load/impl"
import { detectContentPath } from "../../../../content/impl/location"

import { DocumentFactory, initDocumentResource } from "../impl/core"

import { initContentComponent } from "../../content/impl"

import {
    LoadOutlineMenuBadgeRemotePod,
    OutlineMenuExpandRepository,
    OutlineMenuTree,
} from "../../../../../auth/permission/outline/load/infra"

import { DocumentResource } from "../entryPoint"
import { initTestContentAction } from "../../../../content/tests/content"
import { initUnexpectedErrorAction } from "../../../../../availability/unexpectedError/impl"
import { initNotifyUnexpectedErrorSimulator } from "../../../../../availability/unexpectedError/infra/remote/notifyUnexpectedError/testHelper"
import { AuthzRepositoryPod } from "../../../../../common/authz/infra"

export type DocumentRepository = Readonly<{
    authz: AuthzRepositoryPod
    menuExpands: OutlineMenuExpandRepository
}>
export type DocumentRemoteAccess = Readonly<{
    loadMenuBadge: LoadOutlineMenuBadgeRemotePod
}>
export function newTestDocumentResource(
    version: string,
    currentURL: URL,
    menuTree: OutlineMenuTree,
    repository: DocumentRepository,
    remote: DocumentRemoteAccess,
): DocumentResource {
    const locationInfo = initOutlineActionLocationInfo(version, currentURL)
    const factory: DocumentFactory = {
        actions: {
            error: initUnexpectedErrorAction({
                notify: initNotifyUnexpectedErrorSimulator(),
            }),
            breadcrumbList: initOutlineBreadcrumbListAction(locationInfo, { menuTree }),
            menu: initOutlineMenuAction(locationInfo, {
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

    return initDocumentResource(factory, {
        content: {
            getContentPath: () => detectContentPath(version, currentURL),
        },
    })
}
