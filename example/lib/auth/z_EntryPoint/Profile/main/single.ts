import { newMainBreadcrumbListActionPod, newMainMenuActionPod } from "../../../permission/menu/main/main"
import { newClearActionPod } from "../../../sign/authCredential/clear/main"

import { env } from "../../../../y_environment/env"

import { initProfileResource } from "../impl"

import { initNotifyComponent } from "../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initSeasonInfoComponent } from "../../../../example/x_components/Outline/seasonInfo/impl"
import { detectMenuTarget } from "../../../permission/menu/impl"

import { initNotifyAction } from "../../../../availability/error/notify/main/notify"
import { initSeasonAction } from "../../../../example/shared/season/main/season"

import { ProfileEntryPoint, ProfileFactory, ProfileLocationInfo } from "../entryPoint"

export function newProfileAsSingle(): ProfileEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: ProfileFactory = {
        actions: {
            initClear: newClearActionPod(webStorage),
            initBreadcrumbList: newMainBreadcrumbListActionPod(),
            initMenu: newMainMenuActionPod(webStorage),

            notify: initNotifyAction(),
            season: initSeasonAction(),
        },
        components: {
            error: initNotifyComponent,
            seasonInfo: initSeasonInfoComponent,
        },
    }
    const locationInfo: ProfileLocationInfo = {
        getMenuTarget: () => detectMenuTarget(env.version, currentURL),
    }
    const resource = initProfileResource(factory, locationInfo)
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
