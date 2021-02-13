import { env } from "../../../../y_environment/env"

import { initProfileResource } from "../impl"

import { initErrorComponent } from "../../../../availability/x_Resource/Error/error/impl"
import { initSeasonInfoComponent } from "../../../../example/x_components/Outline/seasonInfo/impl"
import { initMenuListComponent } from "../../Outline/menuList/impl"
import { initBreadcrumbListComponent } from "../../Outline/breadcrumbList/impl"
import { detectMenuTarget } from "../../../permission/menu/impl/location"

import { initNotifyAction } from "../../../../availability/notify/main/notify"
import { initSeasonAction } from "../../../../example/shared/season/main/season"
import { initCredentialAction } from "../../../common/credential/main/credential"
import { initMainMenuAction } from "../../../permission/menu/main/mainMenu"
import { initLogoutAction } from "../../../login/credentialStore/main/logout"

import { ProfileEntryPoint, ProfileFactory, ProfileLocationInfo } from "../entryPoint"

export function newProfileAsSingle(): ProfileEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: ProfileFactory = {
        actions: {
            notify: initNotifyAction(),
            credential: initCredentialAction(webStorage),
            menu: initMainMenuAction(webStorage),
            season: initSeasonAction(),
            logout: initLogoutAction(webStorage),
        },
        components: {
            error: initErrorComponent,
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
