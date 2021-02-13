import { newClearActionPod } from "../../../sign/authCredential/clear/main"

import { env } from "../../../../y_environment/env"

import { initProfileResource } from "../impl"

import { initNotifyComponent } from "../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initSeasonInfoComponent } from "../../../../example/x_components/Outline/seasonInfo/impl"
import { initMenuListComponent } from "../../Outline/menuList/impl"
import { initBreadcrumbListComponent } from "../../Outline/breadcrumbList/impl"
import { detectMenuTarget } from "../../../permission/menu/impl/location"

import { initNotifyAction } from "../../../../availability/error/notify/main/notify"
import { initSeasonAction } from "../../../../example/shared/season/main/season"
import { initMainMenuAction } from "../../../permission/menu/main/mainMenu"

import { ProfileEntryPoint, ProfileFactory, ProfileLocationInfo } from "../entryPoint"

export function newProfileAsSingle(): ProfileEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: ProfileFactory = {
        actions: {
            initClear: newClearActionPod(webStorage),

            notify: initNotifyAction(),
            menu: initMainMenuAction(webStorage),
            season: initSeasonAction(),
        },
        components: {
            error: initNotifyComponent,
            menuList: initMenuListComponent,
            breadcrumbList: initBreadcrumbListComponent,
            seasonInfo: initSeasonInfoComponent,
        },
    }
    const locationInfo: ProfileLocationInfo = {
        menu: {
            getMenuTarget: () => detectMenuTarget(env.version, currentURL),
        },
    }
    const resource = initProfileResource(factory, locationInfo)
    return {
        resource,
        terminate: () => {
            resource.menuList.terminate()
            resource.breadcrumbList.terminate()
            resource.seasonInfo.terminate()

            resource.logout.terminate()
        },
    }
}
