import { newMainOutlineAction } from "../../../../../auth/permission/outline/load/main/main"
import { newErrorAction } from "../../../../../availability/unexpectedError/main"
import { newLogoutAction } from "../../../../../auth/sign/kernel/authnInfo/clear/x_Action/Logout/init"

import { initAuthProfileResource, toAuthProfileEntryPoint } from "../impl"

import { initSeasonInfoComponent } from "../../../../../example/x_components/Outline/seasonInfo/impl"

import { initSeasonAction } from "../../../../../example/shared/season/main/season"

import { AuthProfileEntryPoint, ProfileFactory } from "../entryPoint"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentURL: URL
}>
export function newForeground(feature: OutsideFeature): AuthProfileEntryPoint {
    const { webStorage, currentURL } = feature

    const factory: ProfileFactory = {
        actions: {
            error: newErrorAction(),
            ...newMainOutlineAction(webStorage, currentURL),

            season: initSeasonAction(),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,
        },
    }
    const resource = initAuthProfileResource(factory, {
        logout: newLogoutAction(webStorage),
    })
    return toAuthProfileEntryPoint(resource)
}
