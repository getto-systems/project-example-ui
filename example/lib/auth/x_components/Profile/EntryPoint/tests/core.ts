import { initTestNotifyAction } from "../../../../../available/x_components/Error/EntryPoint/tests/core"
import {
    initTestCredentialAction,
    initTestMenuAction,
} from "../../../Outline/Menu/tests/core"
import { initTestSeasonAction } from "../../../../../example/x_components/Outline/seasonInfo/tests/core"

import { detectMenuTarget } from "../../../Outline/Menu/impl/location"

import { DashboardLocationInfo, DashboardFactory, initDashboardResource } from "../impl/core"

import { initErrorComponent } from "../../../../../available/x_components/Error/error/impl"
import { initSeasonInfoComponent } from "../../../../../example/x_components/Outline/seasonInfo/impl"
import { initBreadcrumbListComponent } from "../../../Outline/breadcrumbList/impl"
import { initMenuListComponent } from "../../../Outline/menuList/impl"
import { initExampleComponent } from "../../logout/impl"

import { ApiCredentialRepository } from "../../../../common/credential/infra"
import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../permission/menu/infra"
import { SeasonRepository } from "../../../../../example/shared/season/infra"
import { Clock } from "../../../../../z_infra/clock/infra"

import { ProfileResource } from "../entryPoint"

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
): ProfileResource {
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
