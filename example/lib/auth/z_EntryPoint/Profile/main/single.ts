import { newMainOutlineAction } from "../../../permission/outline/load/main/main"
import { newErrorAction } from "../../../../availability/unexpectedError/main"

import { initAuthProfileResource } from "../impl"

import { initSeasonInfoComponent } from "../../../../example/x_components/Outline/seasonInfo/impl"

import { initSeasonAction } from "../../../../example/shared/season/main/season"

import { AuthProfileEntryPoint, ProfileFactory } from "../entryPoint"
import { newLogoutResource } from "../../../x_Resource/Profile/Logout/main"

export function newAuthProfileAsSingle(): AuthProfileEntryPoint {
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
