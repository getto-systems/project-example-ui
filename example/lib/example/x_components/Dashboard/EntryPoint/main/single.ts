import { DashboardFactory, initDashboardResource } from "../impl/core"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initExampleComponent } from "../../example/impl"

import { newNotifyUnexpectedErrorResource } from "../../../../../avail/action_unexpected_error/init"
import { initSeasonAction } from "../../../../shared/season/main/season"

import { DashboardEntryPoint } from "../entryPoint"
import { newLoadBreadcrumbListResource } from "../../../../../outline/menu/action_load_breadcrumb_list/init"
import { newLoadMenuResource } from "../../../../../outline/menu/action_load_menu/init"
import { homeMenuContent } from "../../../../../outline/menu/kernel/init/home"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newForeground(feature: OutsideFeature): DashboardEntryPoint {
    const menu = homeMenuContent()
    const factory: DashboardFactory = {
        actions: {
            season: initSeasonAction(),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,

            example: initExampleComponent,
        },
    }
    const resource = initDashboardResource(
        factory,
        newLoadBreadcrumbListResource(feature, menu),
        newLoadMenuResource(feature, menu),
        newNotifyUnexpectedErrorResource(feature),
    )
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()
            resource.seasonInfo.terminate()

            resource.example.terminate()
        },
    }
}
