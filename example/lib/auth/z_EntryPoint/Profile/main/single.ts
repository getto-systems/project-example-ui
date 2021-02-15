import { newMainOutlineAction } from "../../../permission/outline/main/main"
import { newClearAuthCredentialAction } from "../../../sign/authCredential/clear/main"

import { initProfileResource } from "../impl"

import { initSeasonInfoComponent } from "../../../../example/x_components/Outline/seasonInfo/impl"

import { newErrorAction } from "../../../../availability/unexpectedError/main"
import { initSeasonAction } from "../../../../example/shared/season/main/season"

import { ProfileEntryPoint, ProfileFactory } from "../entryPoint"

export function newProfileAsSingle(): ProfileEntryPoint {
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
    const resource = initProfileResource(factory)
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()
            resource.breadcrumbList.terminate()
            resource.seasonInfo.terminate()

            resource.logout.terminate()
        },
    }
}
