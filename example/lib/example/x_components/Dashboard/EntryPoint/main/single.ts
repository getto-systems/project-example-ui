import { DashboardFactory, initDashboardResource } from "../impl/core"

import { initNotifyComponent } from "../../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initExampleComponent } from "../../example/impl"

import { newNotifyAction } from "../../../../../availability/error/notify/main/notify"
import { initSeasonAction } from "../../../../shared/season/main/season"
import { newMainOutlineAction } from "../../../../../auth/permission/outline/main/main"

import { DashboardEntryPoint } from "../entryPoint"

export function newDashboardAsSingle(): DashboardEntryPoint {
    const webStorage = localStorage

    const factory: DashboardFactory = {
        actions: {
            ...newMainOutlineAction(webStorage),

            notify: newNotifyAction(),
            season: initSeasonAction(),
        },
        components: {
            error: initNotifyComponent,
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
