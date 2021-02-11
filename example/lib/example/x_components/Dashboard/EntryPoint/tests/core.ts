import { initTestNotifyAction } from "../../../../../available/x_components/Error/EntryPoint/tests/core"
import {
    initTestCredentialAction,
    initTestMenuAction,
} from "../../../../../auth/x_components/Outline/Menu/tests/core"
import { initTestSeasonAction } from "../../../Outline/seasonInfo/tests/core"

import { detectMenuTarget } from "../../../../../auth/x_components/Outline/Menu/impl/location"

import { DashboardLocationInfo, DashboardFactory, initDashboardResource } from "../impl/core"

import { initErrorComponent } from "../../../../../available/x_components/Error/error/impl"
import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initBreadcrumbListComponent } from "../../../../../auth/x_components/Outline/breadcrumbList/impl"
import { initMenuListComponent } from "../../../../../auth/x_components/Outline/menuList/impl"
import { initExampleComponent } from "../../example/impl"

import { ApiCredentialRepository } from "../../../../../auth/common/credential/infra"
import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../../auth/permission/menu/infra"
import { SeasonRepository } from "../../../../shared/season/infra"
import { Clock } from "../../../../../z_infra/clock/infra"

import { DashboardResource } from "../entryPoint"

export type DashboardRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    menuExpands: MenuExpandRepository
    seasons: SeasonRepository
}>
export type DashboardRemoteAccess = Readonly<{
    loadMenuBadge: LoadMenuBadgeRemoteAccess
}>
export function newDashboardResource(
    version: string,
    currentURL: URL,
    menuTree: MenuTree,
    repository: DashboardRepository,
    remote: DashboardRemoteAccess,
    clock: Clock
): DashboardResource {
    const factory: DashboardFactory = {
        actions: {
            notify: initTestNotifyAction(),
            credential: initTestCredentialAction(repository.apiCredentials),
            menu: initTestMenuAction(menuTree, repository.menuExpands, remote.loadMenuBadge),
            season: initTestSeasonAction(repository.seasons, clock),
        },
        components: {
            error: initErrorComponent,
            seasonInfo: initSeasonInfoComponent,
            menuList: initMenuListComponent,
            breadcrumbList: initBreadcrumbListComponent,

            example: initExampleComponent,
        },
    }
    const locationInfo: DashboardLocationInfo = {
        menu: {
            getMenuTarget: () => detectMenuTarget(version, currentURL),
        },
    }

    return initDashboardResource(factory, locationInfo)
}
