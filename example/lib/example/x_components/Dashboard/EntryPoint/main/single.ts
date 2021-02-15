import { DashboardFactory, initDashboardResource } from "../impl/core"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initExampleComponent } from "../../example/impl"

import { newErrorAction } from "../../../../../availability/error/main"
import { initSeasonAction } from "../../../../shared/season/main/season"
import { newMainOutlineAction } from "../../../../../auth/permission/outline/main/main"

import { DashboardEntryPoint } from "../entryPoint"

export function newDashboardAsSingle(): DashboardEntryPoint {
    const webStorage = localStorage

    const factory: DashboardFactory = {
        actions: {
            error: newErrorAction(),
            ...newMainOutlineAction(webStorage),

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
