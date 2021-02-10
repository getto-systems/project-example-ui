import { initCredentialAction, initMenuAction } from "../../../../auth/Outline/Menu/tests/core"
import { initSeasonAction } from "../../../Outline/seasonInfo/tests/core"

import { detectMenuTarget } from "../../../../auth/Outline/Menu/impl/location"

import { DashboardLocationInfo, DashboardFactory, initDashboardResource } from "../impl/core"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initBreadcrumbListComponent } from "../../../../auth/Outline/breadcrumbList/impl"
import { initMenuListComponent } from "../../../../auth/Outline/menuList/impl"
import { initExampleComponent } from "../../example/impl"

import { ApiCredentialRepository } from "../../../../auth/common/credential/infra"
import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../auth/permission/menu/infra"
import { SeasonRepository } from "../../../shared/season/infra"
import { Clock } from "../../../../z_infra/clock/infra"

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
            credential: initCredentialAction(repository.apiCredentials),
            menu: initMenuAction(menuTree, repository.menuExpands, remote.loadMenuBadge),
            season: initSeasonAction(repository.seasons, clock),
        },
        components: {
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
