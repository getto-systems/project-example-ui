import { initTestNotifyAction } from "../../../../../availability/error/notify/tests/notify"
import { initTestMenuAction } from "../../../../../auth/permission/menu/tests/menu"
import { initTestSeasonAction } from "../../../../shared/season/tests/season"

import { detectMenuTarget } from "../../../../../auth/permission/menu/impl/location"

import { DashboardLocationInfo, DashboardFactory, initDashboardResource } from "../impl/core"

import { initNotifyComponent } from "../../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initBreadcrumbListComponent } from "../../../../../auth/z_EntryPoint/Outline/breadcrumbList/impl"
import { initMenuListComponent } from "../../../../../auth/z_EntryPoint/Outline/menuList/impl"
import { initExampleComponent } from "../../example/impl"

import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../../auth/permission/menu/infra"
import { SeasonRepository } from "../../../../shared/season/infra"
import { Clock } from "../../../../../z_infra/clock/infra"

import { DashboardResource } from "../entryPoint"
import { ApiCredentialRepository } from "../../../../../common/auth/apiCredential/infra"

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
            notify: initTestNotifyAction(),
            menu: initTestMenuAction(
                repository.apiCredentials,
                menuTree,
                repository.menuExpands,
                remote.loadMenuBadge
            ),
            season: initTestSeasonAction(repository.seasons, clock),
        },
        components: {
            error: initNotifyComponent,
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
