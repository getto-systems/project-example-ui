import { initCredentialAction, initMenuAction } from "../../../Outline/Menu/tests/core"
import { initSeasonAction } from "../../../Outline/seasonInfo/tests/core"

import { detectMenuTarget } from "../../../Outline/Menu/impl/location"
import { MenuBadgeSimulator } from "../../../shared/menu/impl/client/menuBadge/simulate"

import { DashboardCollector, DashboardFactory, initDashboardResource } from "../impl/core"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initBreadcrumbListComponent } from "../../../Outline/breadcrumbList/impl"
import { initMenuListComponent } from "../../../Outline/menuList/impl"
import { initExampleComponent } from "../../example/impl"

import { ApiCredentialRepository } from "../../../../auth/common/credential/infra"
import { MenuExpandRepository, MenuTree } from "../../../shared/menu/infra"

import { DashboardResource } from "../view"

import { SeasonRepository } from "../../../shared/season/infra"
import { Clock } from "../../../../z_infra/clock/infra"

export type DashboardRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    menuExpands: MenuExpandRepository
    seasons: SeasonRepository
}>
export type DashboardSimulator = Readonly<{
    menuBadge: MenuBadgeSimulator
}>
export function newDashboardResource(
    version: string,
    currentURL: URL,
    menuTree: MenuTree,
    repository: DashboardRepository,
    simulator: DashboardSimulator,
    clock: Clock
): DashboardResource {
    const factory: DashboardFactory = {
        actions: {
            credential: initCredentialAction(repository.apiCredentials),
            menu: initMenuAction(menuTree, repository.menuExpands, simulator.menuBadge),
            season: initSeasonAction(repository.seasons, clock),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,
            menuList: initMenuListComponent,
            breadcrumbList: initBreadcrumbListComponent,

            example: initExampleComponent,
        },
    }
    const collector: DashboardCollector = {
        menu: {
            getMenuTarget: () => detectMenuTarget(version, currentURL),
        },
    }

    return initDashboardResource(factory, collector)
}
