import { newMainOutlineAction } from "../../../permission/outline/main/main"
import { newClearAction } from "../../../sign/authCredential/clear/main"

import { initProfileResource } from "../impl"

import { initSeasonInfoComponent } from "../../../../example/x_components/Outline/seasonInfo/impl"

import { newErrorAction } from "../../../../availability/error/main"
import { initSeasonAction } from "../../../../example/shared/season/main/season"

import { ProfileEntryPoint, ProfileFactory } from "../entryPoint"

export function newProfileAsSingle(): ProfileEntryPoint {
    const webStorage = localStorage

    const factory: ProfileFactory = {
        actions: {
            error: newErrorAction(),
            clear: newClearAction(webStorage),
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
