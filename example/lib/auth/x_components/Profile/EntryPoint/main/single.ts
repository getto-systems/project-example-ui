import { env } from "../../../../../y_environment/env"

import { DashboardLocationInfo, DashboardFactory, initDashboardResource } from "../impl/core"

import { initErrorComponent } from "../../../../../available/x_components/Error/error/impl"
import { initSeasonInfoComponent } from "../../../../../example/x_components/Outline/seasonInfo/impl"
import { initMenuListComponent } from "../../../Outline/menuList/impl"
import { initBreadcrumbListComponent } from "../../../Outline/breadcrumbList/impl"
import { initExampleComponent } from "../../logout/impl"
import { detectMenuTarget } from "../../../Outline/Menu/impl/location"

import { initNotifyAction } from "../../../../../available/x_components/Error/EntryPoint/main/action/notify"
import {
    initCredentialAction,
    initMainMenuAction,
} from "../../../Outline/Menu/main/core"
import { initSeasonAction } from "../../../../../example/x_components/Outline/GlobalInfo/main/core"

import { ProfileEntryPoint } from "../entryPoint"

export function newDashboardAsSingle(): ProfileEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: DashboardFactory = {
        actions: {
            notify: initNotifyAction(),
            credential: initCredentialAction(webStorage),
            menu: initMainMenuAction(webStorage),
            season: initSeasonAction(),
        },
        components: {
            error: initErrorComponent,
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
