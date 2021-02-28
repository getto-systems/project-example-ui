import { initTestSeasonAction } from "../../../../shared/season/tests/season"

import {
    initOutlineBreadcrumbListAction,
    initOutlineMenuAction,
    initOutlineActionLocationInfo,
} from "../../../../../auth/permission/outline/load/impl"

import { DashboardFactory, initDashboardResource } from "../impl/core"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initExampleComponent } from "../../example/impl"

import {
    LoadOutlineMenuBadgeRemote,
    OutlineMenuExpandRepository,
    OutlineMenuTree,
} from "../../../../../auth/permission/outline/load/infra"
import { SeasonRepository } from "../../../../shared/season/infra"
import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import { AuthzRepository } from "../../../../../common/authz/infra"

import { DashboardResource } from "../entryPoint"
import { initUnexpectedErrorAction } from "../../../../../availability/unexpectedError/impl"
import { initNotifyUnexpectedErrorSimulator } from "../../../../../availability/unexpectedError/infra/remote/notifyUnexpectedError/testHelper"

export type DashboardRepository = Readonly<{
    authz: AuthzRepository
    menuExpands: OutlineMenuExpandRepository
    seasons: SeasonRepository
}>
export type DashboardRemoteAccess = Readonly<{
    loadMenuBadge: LoadOutlineMenuBadgeRemote
}>
export function newTestDashboardResource(
    version: string,
    currentURL: URL,
    menuTree: OutlineMenuTree,
    repository: DashboardRepository,
    remote: DashboardRemoteAccess,
    clock: Clock,
): DashboardResource {
    const locationInfo = initOutlineActionLocationInfo(version, currentURL)
    const factory: DashboardFactory = {
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

            season: initTestSeasonAction(repository.seasons, clock),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,

            example: initExampleComponent,
        },
    }

    return initDashboardResource(factory)
}
