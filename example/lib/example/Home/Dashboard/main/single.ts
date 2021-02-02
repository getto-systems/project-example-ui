import { env } from "../../../../y_static/env"

import { DashboardCollector, DashboardFactory, initDashboardResource } from "../impl/core"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initMenuListComponent } from "../../../../auth/Outline/menuList/impl"
import { initBreadcrumbListComponent } from "../../../../auth/Outline/breadcrumbList/impl"
import { initExampleComponent } from "../../example/impl"
import { detectMenuTarget } from "../../../../auth/Outline/Menu/impl/location"

import { loadApiNonce, loadApiRoles } from "../../../../auth/common/credential/impl/core"
import { loadSeason } from "../../../shared/season/impl/core"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../../../auth/permission/menu/impl/core"
import { mainMenuTree } from "../../../../auth/Outline/Menu/impl/menu/menuTree"

import { initDateClock } from "../../../../z_infra/clock/date"
import { initMemoryApiCredentialRepository } from "../../../../auth/common/credential/impl/repository/apiCredential/memory"
import { initMemorySeasonRepository } from "../../../shared/season/impl/repository/season/memory"
import { initSimulateMenuBadgeClient } from "../../../../auth/permission/menu/impl/client/menuBadge/simulate"
import { initStorageMenuExpandRepository } from "../../../../auth/permission/menu/impl/repository/menuExpand/storage"

import { DashboardEntryPoint } from "../entryPoint"

import { CredentialAction } from "../../../../auth/common/credential/action"
import { MenuAction } from "../../../../auth/permission/menu/action"
import { SeasonAction } from "../../../shared/season/action"

import { markSeason } from "../../../shared/season/data"
import { markApiNonce, markApiRoles } from "../../../../auth/common/credential/data"

export function newDashboardAsSingle(): DashboardEntryPoint {
    const menuExpandStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: DashboardFactory = {
        actions: {
            credential: initCredentialAction(),
            menu: initMenuAction(menuExpandStorage),
            season: initSeasonAction(),
        },
        components: {
            menuList: initMenuListComponent,
            breadcrumbList: initBreadcrumbListComponent,
            seasonInfo: initSeasonInfoComponent,

            example: initExampleComponent,
        },
    }
    const collector: DashboardCollector = {
        menu: {
            getMenuTarget: () => detectMenuTarget(env.version, currentURL),
        },
    }
    const resource = initDashboardResource(factory, collector)
    return {
        resource,
        terminate: () => {
            resource.menuList.terminate()
            resource.breadcrumbList.terminate()
            resource.seasonInfo.terminate()

            resource.example.terminate()
        },
    }
}

function initCredentialAction(): CredentialAction {
    const apiCredentials = initMemoryApiCredentialRepository(
        markApiNonce("api-nonce"),
        markApiRoles(["admin"])
    )

    return {
        loadApiNonce: loadApiNonce({ apiCredentials }),
        loadApiRoles: loadApiRoles({ apiCredentials }),
    }
}
function initMenuAction(menuExpandStorage: Storage): MenuAction {
    const menuTree = mainMenuTree()
    const menuBadge = initSimulateMenuBadgeClient({
        getMenuBadge: async () => {
            return {}
        },
    })
    const menuExpands = initStorageMenuExpandRepository(
        menuExpandStorage,
        env.storageKey.menuExpand.main
    )

    return {
        loadBreadcrumb: loadBreadcrumb({ menuTree }),
        loadMenu: loadMenu({ menuTree, menuBadge, menuExpands }),
        toggleMenuExpand: toggleMenuExpand({ menuExpands }),
    }
}
function initSeasonAction(): SeasonAction {
    return {
        loadSeason: loadSeason({
            seasons: initMemorySeasonRepository({
                stored: true,
                season: markSeason({ year: new Date().getFullYear() }),
            }),
            clock: initDateClock(),
        }),
    }
}
