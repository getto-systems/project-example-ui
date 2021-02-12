import { detectMenuTarget } from "../../../../permission/menu/impl/location"

import { DashboardLocationInfo, ProfileFactory, initDashboardResource } from "../impl/core"

import { initErrorComponent } from "../../../../../available/x_components/Error/error/impl"
import { initSeasonInfoComponent } from "../../../../../example/x_components/Outline/seasonInfo/impl"
import { initBreadcrumbListComponent } from "../../../Outline/breadcrumbList/impl"
import { initMenuListComponent } from "../../../Outline/menuList/impl"
import { initLogoutComponent } from "../../logout/impl"

import { initTestNotifyAction } from "../../../../../available/notify/tests/notify"
import { initTestSeasonAction } from "../../../../../example/shared/season/tests/season"
import { initTestLogoutAction } from "../../../../login/credentialStore/tests/logout"
import { initTestCredentialAction } from "../../../../common/credential/tests/credential"
import { initTestMenuAction } from "../../../../permission/menu/tests/menu"

import { AuthCredentialRepository } from "../../../../login/credentialStore/infra"
import { ApiCredentialRepository } from "../../../../common/credential/infra"
import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../permission/menu/infra"
import { SeasonRepository } from "../../../../../example/shared/season/infra"
import { Clock } from "../../../../../z_infra/clock/infra"

import { ProfileResource } from "../entryPoint"

export type ProfileTestRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    menuExpands: MenuExpandRepository
    seasons: SeasonRepository
    authCredentials: AuthCredentialRepository
}>
export type ProfileTestRemoteAccess = Readonly<{
    loadMenuBadge: LoadMenuBadgeRemoteAccess
}>
export function newTestProfileResource(
    version: string,
    currentURL: URL,
    menuTree: MenuTree,
    repository: ProfileTestRepository,
    remote: ProfileTestRemoteAccess,
    clock: Clock
): ProfileResource {
    const factory: ProfileFactory = {
        actions: {
            notify: initTestNotifyAction(),
            credential: initTestCredentialAction(repository.apiCredentials),
            menu: initTestMenuAction(menuTree, repository.menuExpands, remote.loadMenuBadge),
            season: initTestSeasonAction(repository.seasons, clock),
            logout: initTestLogoutAction(repository.authCredentials),
        },
        components: {
            error: initErrorComponent,
            seasonInfo: initSeasonInfoComponent,
            menuList: initMenuListComponent,
            breadcrumbList: initBreadcrumbListComponent,

            logout: initLogoutComponent,
        },
    }
    const locationInfo: DashboardLocationInfo = {
        menu: {
            getMenuTarget: () => detectMenuTarget(version, currentURL),
        },
    }

    return initDashboardResource(factory, locationInfo)
}
