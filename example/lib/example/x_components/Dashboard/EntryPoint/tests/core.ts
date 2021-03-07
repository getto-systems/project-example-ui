import { initTestSeasonAction } from "../../../../shared/season/tests/season"

import {
    initOutlineBreadcrumbListAction,
    initOutlineMenuAction,
} from "../../../../../auth/permission/outline/load/impl"

import { DashboardFactory, initDashboardResource } from "../impl/core"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initExampleComponent } from "../../example/impl"

import {
    LoadOutlineMenuBadgeRemotePod,
    OutlineMenuExpandRepositoryPod,
    OutlineMenuTree,
} from "../../../../../auth/permission/outline/load/infra"
import { SeasonRepository } from "../../../../shared/season/infra"
import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import { AuthzRepositoryPod } from "../../../../../common/authz/infra"

import { DashboardResource } from "../entryPoint"
import { initLoadOutlineMenuLocationDetecter } from "../../../../../auth/permission/outline/load/testHelper"
import { initNotifyUnexpectedErrorResource } from "../../../../../avail/unexpectedError/Action/impl"
import { NotifyUnexpectedErrorRemotePod } from "../../../../../avail/unexpectedError/infra"
import { initRemoteSimulator } from "../../../../../z_vendor/getto-application/infra/remote/simulate"
import { initNotifyUnexpectedErrorCoreAction } from "../../../../../avail/unexpectedError/Action/Core/impl"

export type DashboardRepository = Readonly<{
    authz: AuthzRepositoryPod
    menuExpands: OutlineMenuExpandRepositoryPod
    seasons: SeasonRepository
}>
export type DashboardRemoteAccess = Readonly<{
    loadMenuBadge: LoadOutlineMenuBadgeRemotePod
}>
export function newTestDashboardResource(
    version: string,
    currentURL: URL,
    menuTree: OutlineMenuTree,
    repository: DashboardRepository,
    remote: DashboardRemoteAccess,
    clock: Clock,
): DashboardResource {
    const detecter = initLoadOutlineMenuLocationDetecter(currentURL, version)
    const factory: DashboardFactory = {
        actions: {
            breadcrumbList: initOutlineBreadcrumbListAction(detecter, { version, menuTree }),
            menu: initOutlineMenuAction(detecter, {
                ...repository,
                ...remote,
                version,
                menuTree,
            }),

            season: initTestSeasonAction(repository.seasons, clock),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,

            example: initExampleComponent,
        },
    }

    return initDashboardResource(
        factory,
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
