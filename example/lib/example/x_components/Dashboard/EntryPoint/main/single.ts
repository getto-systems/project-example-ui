import { env } from "../../../../../y_environment/env"

import { DashboardLocationInfo, DashboardFactory, initDashboardResource } from "../impl/core"

import { initNotifyComponent } from "../../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initExampleComponent } from "../../example/impl"
import { detectMenuTarget } from "../../../../../auth/permission/menu/impl"

import { initNotifyAction } from "../../../../../availability/error/notify/main/notify"
import { initSeasonAction } from "../../../../shared/season/main/season"
import {
    newMainBreadcrumbListActionPod,
    newMainMenuActionPod,
} from "../../../../../auth/permission/menu/main/main"

import { DashboardEntryPoint } from "../entryPoint"

export function newDashboardAsSingle(): DashboardEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: DashboardFactory = {
        actions: {
            initBreadcrumbList: newMainBreadcrumbListActionPod(),
            initMenu: newMainMenuActionPod(webStorage),

            notify: initNotifyAction(),
            season: initSeasonAction(),
        },
        components: {
            error: initNotifyComponent,
            seasonInfo: initSeasonInfoComponent,

            example: initExampleComponent,
        },
    }
    const locationInfo: DashboardLocationInfo = {
        getMenuTarget: () => detectMenuTarget(env.version, currentURL),
    }
    const resource = initDashboardResource(factory, locationInfo)
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()
            resource.breadcrumbList.terminate()
            resource.seasonInfo.terminate()

            resource.example.terminate()
        },
    }
}
