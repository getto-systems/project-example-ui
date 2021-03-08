import { newNotifyUnexpectedErrorResource } from "../../../../../avail/unexpectedError/Action/init"
import { newLogoutResource } from "../../../../../auth/sign/kernel/authInfo/clear/Action/init"

import { initAuthProfileResource, toAuthProfileEntryPoint } from "../impl"

import { initSeasonInfoComponent } from "../../../../../example/x_components/Outline/seasonInfo/impl"

import { initSeasonAction } from "../../../../../example/shared/season/main/season"

import { AuthProfileEntryPoint, ProfileFactory } from "../entryPoint"
import { newLoadBreadcrumbListResource } from "../../../../../outline/menu/loadBreadcrumbList/Action/init"
import { newLoadMenuResource } from "../../../../../outline/menu/loadMenu/Action/init"
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
