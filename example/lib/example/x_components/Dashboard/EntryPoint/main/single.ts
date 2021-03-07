import { DashboardFactory, initDashboardResource } from "../impl/core"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initExampleComponent } from "../../example/impl"

import { newNotifyUnexpectedErrorResource } from "../../../../../avail/unexpectedError/Action/init"
import { initSeasonAction } from "../../../../shared/season/main/season"
import { newMainOutlineAction } from "../../../../../auth/permission/outline/load/main/main"

import { DashboardEntryPoint } from "../entryPoint"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newForeground(feature: OutsideFeature): DashboardEntryPoint {
    const { webStorage, currentLocation } = feature

    const factory: DashboardFactory = {
        actions: {
            ...newMainOutlineAction(webStorage, currentLocation),

            season: initSeasonAction(),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,

            example: initExampleComponent,
        },
    }
    const resource = initDashboardResource(factory, newNotifyUnexpectedErrorResource(feature))
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
