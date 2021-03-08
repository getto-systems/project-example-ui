import { ProfileFactory, AuthProfileResource, AuthProfileEntryPoint } from "./entryPoint"

import { LogoutResource } from "../../../../auth/sign/kernel/authInfo/clear/Action/resource"
import { NotifyUnexpectedErrorResource } from "../../../../avail/unexpectedError/Action/resource"
import { LoadBreadcrumbListResource } from "../../../../outline/menu/loadBreadcrumbList/Action/resource"
import { LoadMenuResource } from "../../../../outline/menu/loadMenu/Action/resource"

export function toAuthProfileEntryPoint(resource: AuthProfileResource): AuthProfileEntryPoint {
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()
            resource.seasonInfo.terminate()

            resource.logout.terminate()
        },
    }
}

export function initAuthProfileResource(
    factory: ProfileFactory,
    breadcrumbList: LoadBreadcrumbListResource,
    menu: LoadMenuResource,
    logout: LogoutResource,
    error: NotifyUnexpectedErrorResource,
): AuthProfileResource {
    const actions = {
        loadSeason: factory.actions.season.loadSeason(),
    }
    return {
        seasonInfo: factory.components.seasonInfo(actions),

        ...breadcrumbList,
        ...menu,
        ...logout,
        ...error,
    }
}
