import { DashboardFactory, initDashboardResource } from "../impl/core"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initExampleComponent } from "../../example/impl"

import { newErrorAction } from "../../../../../availability/unexpectedError/main"
import { initSeasonAction } from "../../../../shared/season/main/season"
import { newMainOutlineAction } from "../../../../../auth/permission/outline/load/main/main"

import { DashboardEntryPoint } from "../entryPoint"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentURL: URL
}>
export function newForeground(feature: OutsideFeature): DashboardEntryPoint {
    const { webStorage, currentURL } = feature

    const factory: DashboardFactory = {
        actions: {
            error: newErrorAction(),
            ...newMainOutlineAction(webStorage, currentURL),

            season: initSeasonAction(),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,

            example: initExampleComponent,
        },
    }
    const resource = initDashboardResource(factory)
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
