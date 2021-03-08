import { newNotifyUnexpectedErrorResource } from "../../../../../avail/action_unexpected_error/init"
import { newLogoutResource } from "../../../../../auth/sign/kernel/auth_info/action_logout/init"

import { initAuthProfileResource, toAuthProfileEntryPoint } from "../impl"

import { initSeasonInfoComponent } from "../../../../../example/x_components/Outline/seasonInfo/impl"

import { initSeasonAction } from "../../../../../example/common/season/main/season"

import { AuthProfileEntryPoint, ProfileFactory } from "../entryPoint"
import { newLoadBreadcrumbListResource } from "../../../../../outline/menu/action_load_breadcrumb_list/init"
import { newLoadMenuResource } from "../../../../../outline/menu/action_load_menu/init"
import { homeMenuContent } from "../../../../../outline/menu/kernel/init/home"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newForeground(feature: OutsideFeature): AuthProfileEntryPoint {
    const menu = homeMenuContent()

    const factory: ProfileFactory = {
        actions: {
            season: initSeasonAction(),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,
        },
    }
    const resource = initAuthProfileResource(
        factory,
        newLoadBreadcrumbListResource(feature, menu),
        newLoadMenuResource(feature, menu),
        newLogoutResource(feature),
        newNotifyUnexpectedErrorResource(feature),
    )
    return toAuthProfileEntryPoint(resource)
}
