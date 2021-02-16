import { newMainOutlineAction } from "../../../permission/outline/load/main/main"
import { newClearAuthCredentialAction } from "../../../sign/authCredential/clear/main"
import { newErrorAction } from "../../../../availability/unexpectedError/main"

import { initAuthProfileResource } from "../impl"

import { initSeasonInfoComponent } from "../../../../example/x_components/Outline/seasonInfo/impl"

import { initSeasonAction } from "../../../../example/shared/season/main/season"

import { AuthProfileEntryPoint, ProfileFactory } from "../entryPoint"

export function newAuthProfileAsSingle(): AuthProfileEntryPoint {
    const webStorage = localStorage

    const factory: ProfileFactory = {
        actions: {
            error: newErrorAction(),
            clear: newClearAuthCredentialAction(webStorage),
            ...newMainOutlineAction(webStorage),

            season: initSeasonAction(),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,
        },
    }
    const resource = initAuthProfileResource(factory)
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
