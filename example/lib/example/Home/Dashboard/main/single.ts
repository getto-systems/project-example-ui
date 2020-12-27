import { env } from "../../../../y_static/env"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initMenuListComponent } from "../../../Outline/menuList/impl"
import { initBreadcrumbListComponent } from "../../../Outline/breadcrumbList/impl"
import { initExampleComponent } from "../../example/impl"
import { detectMenuTarget } from "../../../Outline/Menu/impl/location"

import { loadApiNonce, loadApiRoles } from "../../../shared/credential/impl/core"
import { loadSeason } from "../../../shared/season/impl/core"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../../shared/menu/impl/core"
import { mainMenuTree } from "../../../shared/menu/impl/menuTree"
import { initDashboardResource } from "../impl/core"

import { MenuBadgeMap } from "../../../shared/menu/infra"

import { initDateClock } from "../../../../z_infra/clock/date"
import { initMemoryApiCredentialRepository } from "../../../shared/credential/impl/repository/apiCredential/memory"
import { initMemorySeasonRepository } from "../../../shared/season/impl/repository/season/memory"
import { initSimulateMenuBadgeClient } from "../../../shared/menu/impl/client/menuBadge/simulate"
import { initStorageMenuExpandRepository } from "../../../shared/menu/impl/repository/menuExpand/storage"

import { DashboardEntryPoint } from "../view"

import { markSeason } from "../../../shared/season/data"
import { markApiNonce, markApiRoles } from "../../../shared/credential/data"

export function newDashboardAsSingle(): DashboardEntryPoint {
    const menuExpandStorage = localStorage
    const currentLocation = location

    const factory = {
        actions: {
            credential: initCredentialAction(),
            menu: initMenuAction(menuExpandStorage),
            season: initSeasonAction(),
        },
        components: {
            season: initSeasonInfoComponent,
            menu: initMenuListComponent,
            breadcrumb: initBreadcrumbListComponent,

            example: initExampleComponent,
        },
    }
    const collector = {
        menu: {
            getMenuTarget: () => detectMenuTarget(env.version, currentLocation),
        },
    }
    return {
        resource: initDashboardResource(factory, collector),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}

function initCredentialAction() {
    const apiCredentials = initMemoryApiCredentialRepository(
        markApiNonce("api-nonce"),
        markApiRoles(["admin"])
    )

    return {
        loadApiNonce: loadApiNonce({ apiCredentials }),
        loadApiRoles: loadApiRoles({ apiCredentials }),
    }
}
function initMenuAction(menuExpandStorage: Storage) {
    const menuTree = mainMenuTree()
    const menuBadge = initSimulateMenuBadgeClient({
        getMenuBadge: async () => new MenuBadgeMap(),
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
function initSeasonAction() {
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
