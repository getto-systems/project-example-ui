import {
    initOutlineBreadcrumbListAction,
    initOutlineMenuAction,
} from "../../../../../auth/permission/outline/load/impl"

import { DocumentFactory, initDocumentResource } from "../impl/core"

import { initContentComponent } from "../../content/impl"

import {
    LoadOutlineMenuBadgeRemotePod,
    OutlineMenuExpandRepositoryPod,
    OutlineMenuTree,
} from "../../../../../auth/permission/outline/load/infra"

import { DocumentResource } from "../entryPoint"
import { initTestContentAction } from "../../../../content/tests/content"
import { AuthzRepositoryPod } from "../../../../../common/authz/infra"
import { initLoadOutlineMenuLocationDetecter } from "../../../../../auth/permission/outline/load/testHelper"
import { initLoadContentLocationDetecter } from "../../../../content/testHelper"
import { initNotifyUnexpectedErrorCoreAction } from "../../../../../availability/unexpectedError/Action/Core/impl"
import { NotifyUnexpectedErrorRemotePod } from "../../../../../availability/unexpectedError/infra"
import { initRemoteSimulator } from "../../../../../z_vendor/getto-application/infra/remote/simulate"
import { initNotifyUnexpectedErrorResource } from "../../../../../availability/unexpectedError/Action/impl"

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

    return initDocumentResource(
        factory,
        {
            content: initLoadContentLocationDetecter(currentURL, version),
        },
        initNotifyUnexpectedErrorResource(
            initNotifyUnexpectedErrorCoreAction({
                authz: repository.authz,
                notify: standard_notify(),
            }),
        ),
    )
}

function standard_notify(): NotifyUnexpectedErrorRemotePod {
    return initRemoteSimulator(() => ({ success: true, value: true }), { wait_millisecond: 0 })
}
