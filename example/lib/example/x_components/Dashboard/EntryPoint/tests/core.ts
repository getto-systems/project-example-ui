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
import { initUnexpectedErrorAction } from "../../../../../availability/unexpectedError/impl"
import { initNotifyUnexpectedErrorSimulator } from "../../../../../availability/unexpectedError/infra/remote/notifyUnexpectedError/testHelper"
import { initLoadOutlineMenuLocationDetecter } from "../../../../../auth/permission/outline/load/testHelper"

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
            error: initUnexpectedErrorAction({
                notify: initNotifyUnexpectedErrorSimulator(),
            }),
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

    return initDashboardResource(factory)
}
