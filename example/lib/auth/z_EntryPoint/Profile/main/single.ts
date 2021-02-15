import { newMainOutlineAction } from "../../../permission/outline/main/main"
import { newClearAction } from "../../../sign/authCredential/clear/main"

import { initProfileResource } from "../impl"

import { initNotifyComponent } from "../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initSeasonInfoComponent } from "../../../../example/x_components/Outline/seasonInfo/impl"

import { newNotifyAction } from "../../../../availability/error/notify/main/notify"
import { initSeasonAction } from "../../../../example/shared/season/main/season"

import { ProfileEntryPoint, ProfileFactory } from "../entryPoint"

export function newProfileAsSingle(): ProfileEntryPoint {
    const webStorage = localStorage

    const factory: ProfileFactory = {
        actions: {
            clear: newClearAction(webStorage),
            ...newMainOutlineAction(webStorage),

            notify: newNotifyAction(),
            season: initSeasonAction(),
        },
        components: {
            error: initNotifyComponent,
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
