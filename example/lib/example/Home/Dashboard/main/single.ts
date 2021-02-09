import { env } from "../../../../y_environment/env"

import { DashboardLocationInfo, DashboardFactory, initDashboardResource } from "../impl/core"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initMenuListComponent } from "../../../../auth/Outline/menuList/impl"
import { initBreadcrumbListComponent } from "../../../../auth/Outline/breadcrumbList/impl"
import { initExampleComponent } from "../../example/impl"
import { detectMenuTarget } from "../../../../auth/Outline/Menu/impl/location"

import { initCredentialAction, initMainMenuAction } from "../../../../auth/Outline/Menu/main/core"
import { initSeasonAction } from "../../../Outline/GlobalInfo/main/core"

import { DashboardEntryPoint } from "../entryPoint"

export function newDashboardAsSingle(): DashboardEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: DashboardFactory = {
        actions: {
            credential: initCredentialAction(webStorage),
            menu: initMainMenuAction(webStorage),
            season: initSeasonAction(),
        },
        components: {
            menuList: initMenuListComponent,
            breadcrumbList: initBreadcrumbListComponent,
            seasonInfo: initSeasonInfoComponent,

            example: initExampleComponent,
        },
    }
    const locationInfo: DashboardLocationInfo = {
        menu: {
            getMenuTarget: () => detectMenuTarget(env.version, currentURL),
        },
    }
    const resource = initDashboardResource(factory, locationInfo)
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
