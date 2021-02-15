import { initTestSeasonAction } from "../../../../shared/season/tests/season"

import {
    initBreadcrumbListAction,
    initMenuAction,
    initOutlineActionLocationInfo,
} from "../../../../../auth/permission/outline/impl"

import { DashboardFactory, initDashboardResource } from "../impl/core"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initExampleComponent } from "../../example/impl"

import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../../auth/permission/outline/infra"
import { SeasonRepository } from "../../../../shared/season/infra"
import { Clock } from "../../../../../z_infra/clock/infra"

import { DashboardResource } from "../entryPoint"
import { ApiCredentialRepository } from "../../../../../common/apiCredential/infra"
import { initNotifySimulateRemoteAccess } from "../../../../../availability/error/infra/remote/notify/simulate"
import { initErrorAction } from "../../../../../availability/error/impl"

export type DashboardRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    menuExpands: MenuExpandRepository
    seasons: SeasonRepository
}>
export type DashboardRemoteAccess = Readonly<{
    loadMenuBadge: LoadMenuBadgeRemoteAccess
}>
export function newTestDashboardResource(
    version: string,
    currentURL: URL,
    menuTree: MenuTree,
    repository: DashboardRepository,
    remote: DashboardRemoteAccess,
    clock: Clock
): DashboardResource {
    const locationInfo = initOutlineActionLocationInfo(version, currentURL)
    const factory: DashboardFactory = {
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

            season: initTestSeasonAction(repository.seasons, clock),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,

            example: initExampleComponent,
        },
    }

    return initDashboardResource(factory)
}
