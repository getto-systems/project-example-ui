import { newMainOutlineAction } from "../../../../../auth/permission/outline/load/main/main"
import { newNotifyUnexpectedErrorAction } from "../../../../../availability/unexpectedError/Action/init"
import { newLogoutResource } from "../../../../../auth/sign/kernel/authInfo/clear/Action/init"

import { initAuthProfileResource, toAuthProfileEntryPoint } from "../impl"

import { initSeasonInfoComponent } from "../../../../../example/x_components/Outline/seasonInfo/impl"

import { initSeasonAction } from "../../../../../example/shared/season/main/season"

import { AuthProfileEntryPoint, ProfileFactory } from "../entryPoint"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newForeground(feature: OutsideFeature): AuthProfileEntryPoint {
    const { webStorage, currentLocation } = feature

    const factory: ProfileFactory = {
        actions: {
            error: newNotifyUnexpectedErrorAction(webStorage),
            ...newMainOutlineAction(webStorage, currentLocation),

            season: initSeasonAction(),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,
        },
    }
    const resource = initAuthProfileResource(factory, newLogoutResource(webStorage))
    return toAuthProfileEntryPoint(resource)
}
