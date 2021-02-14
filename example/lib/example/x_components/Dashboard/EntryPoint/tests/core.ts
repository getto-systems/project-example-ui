import { initTestNotifyAction } from "../../../../../availability/error/notify/tests/notify"
import { initTestSeasonAction } from "../../../../shared/season/tests/season"

import {
    detectMenuTarget,
    initBreadcrumbListActionPod,
    initMenuActionPod,
} from "../../../../../auth/permission/menu/impl"

import { DashboardLocationInfo, DashboardFactory, initDashboardResource } from "../impl/core"

import { initNotifyComponent } from "../../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initExampleComponent } from "../../example/impl"

import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../../auth/permission/menu/infra"
import { SeasonRepository } from "../../../../shared/season/infra"
import { Clock } from "../../../../../z_infra/clock/infra"

import { DashboardResource } from "../entryPoint"
import { ApiCredentialRepository } from "../../../../../common/apiCredential/infra"

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
    const factory: DashboardFactory = {
        actions: {
            initBreadcrumbList: initBreadcrumbListActionPod({ menuTree }),
            initMenu: initMenuActionPod({
                ...repository,
                ...remote,
                menuTree,
            }),

            notify: initTestNotifyAction(),
            season: initTestSeasonAction(repository.seasons, clock),
        },
        components: {
            error: initNotifyComponent,
            seasonInfo: initSeasonInfoComponent,

            example: initExampleComponent,
        },
    }
    const locationInfo: DashboardLocationInfo = {
        getMenuTarget: () => detectMenuTarget(version, currentURL),
    }

    return initDashboardResource(factory, locationInfo)
}
