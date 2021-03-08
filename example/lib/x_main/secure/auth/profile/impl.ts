import { ProfileFactory, AuthProfileResource, AuthProfileEntryPoint } from "./entryPoint"

import { LogoutResource } from "../../../../auth/sign/kernel/auth_info/action_logout/resource"
import { NotifyUnexpectedErrorResource } from "../../../../avail/action_unexpected_error/resource"
import { LoadBreadcrumbListResource } from "../../../../outline/menu/action_load_breadcrumb_list/resource"
import { LoadMenuResource } from "../../../../outline/menu/action_load_menu/resource"

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
