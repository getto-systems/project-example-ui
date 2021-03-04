import {
    initOutlineBreadcrumbListAction,
    initOutlineMenuAction,
} from "../../../../../auth/permission/outline/load/impl"
import { detectContentPath } from "../../../../content/impl/location"

import { DocumentFactory, initDocumentResource } from "../impl/core"

import { initContentComponent } from "../../content/impl"

import {
    LoadOutlineMenuBadgeRemotePod,
    OutlineMenuExpandRepositoryPod,
    OutlineMenuTree,
} from "../../../../../auth/permission/outline/load/infra"

import { DocumentResource } from "../entryPoint"
import { initTestContentAction } from "../../../../content/tests/content"
import { initUnexpectedErrorAction } from "../../../../../availability/unexpectedError/impl"
import { initNotifyUnexpectedErrorSimulator } from "../../../../../availability/unexpectedError/infra/remote/notifyUnexpectedError/testHelper"
import { AuthzRepositoryPod } from "../../../../../common/authz/infra"
import { initLoadOutlineMenuLocationDetecter } from "../../../../../auth/permission/outline/load/testHelper"

export type DocumentRepository = Readonly<{
    authz: AuthzRepositoryPod
    menuExpands: OutlineMenuExpandRepositoryPod
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
    const locationInfo = initLoadOutlineMenuLocationDetecter(currentURL, version)
    const factory: DocumentFactory = {
        actions: {
            error: initUnexpectedErrorAction({
                notify: initNotifyUnexpectedErrorSimulator(),
            }),
            breadcrumbList: initOutlineBreadcrumbListAction(locationInfo, { version, menuTree }),
            menu: initOutlineMenuAction(locationInfo, {
                ...repository,
                ...remote,
                version,
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
