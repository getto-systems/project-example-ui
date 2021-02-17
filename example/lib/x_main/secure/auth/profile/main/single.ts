import { newMainOutlineAction } from "../../../../../auth/permission/outline/load/main/main"
import { newErrorAction } from "../../../../../availability/unexpectedError/main"
import { newLogoutResource } from "../../../../../auth/sign/kernel/authnInfo/clear/x_Action/Logout/main"

import { initAuthProfileResource } from "../impl"

import { initSeasonInfoComponent } from "../../../../../example/x_components/Outline/seasonInfo/impl"

import { initSeasonAction } from "../../../../../example/shared/season/main/season"

import { AuthProfileEntryPoint, ProfileFactory } from "../entryPoint"

export function newEntryPoint(): AuthProfileEntryPoint {
    const webStorage = localStorage

    const factory: ProfileFactory = {
        actions: {
            error: newErrorAction(),
            ...newMainOutlineAction(webStorage),

            season: initSeasonAction(),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,
        },
    }
    const resource = initAuthProfileResource(factory, {
        ...newLogoutResource(webStorage),
    })
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()
            resource.breadcrumbList.terminate()
            resource.seasonInfo.terminate()

            resource.clear.terminate()
        },
    }
}
