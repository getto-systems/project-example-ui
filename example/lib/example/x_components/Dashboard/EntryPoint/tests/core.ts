import { initTestNotifyAction } from "../../../../../availability/error/notify/tests/notify"
import { initTestSeasonAction } from "../../../../shared/season/tests/season"

import {
    detectMenuTarget,
    initBreadcrumbListAction,
    initMenuAction,
} from "../../../../../auth/permission/outline/impl"

import { DashboardFactory, initDashboardResource } from "../impl/core"

import { initNotifyComponent } from "../../../../../availability/x_Resource/NotifyError/Notify/impl"
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
import { MenuActionLocationInfo } from "../../../../../auth/permission/outline/action"

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
    const locationInfo: MenuActionLocationInfo = {
        getMenuTarget: () => detectMenuTarget(version, currentURL),
    }
    const factory: DashboardFactory = {
        actions: {
            breadcrumbList: initBreadcrumbListAction(locationInfo, { menuTree }),
            menu: initMenuAction(locationInfo, {
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

    return initDashboardResource(factory)
}
