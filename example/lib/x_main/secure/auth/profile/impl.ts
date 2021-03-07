import { ProfileFactory, AuthProfileResource, AuthProfileEntryPoint } from "./entryPoint"

import { initMenuResource } from "../../../../common/x_Resource/Outline/Menu/impl"

import { LogoutResource } from "../../../../auth/sign/kernel/authInfo/clear/Action/action"
import { NotifyUnexpectedErrorResource } from "../../../../availability/unexpectedError/Action/resource"

export function toAuthProfileEntryPoint(resource: AuthProfileResource): AuthProfileEntryPoint {
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

export function initAuthProfileResource(
    factory: ProfileFactory,
    logout: LogoutResource,
    error: NotifyUnexpectedErrorResource,
): AuthProfileResource {
    const actions = {
        loadSeason: factory.actions.season.loadSeason(),
    }
    return {
        seasonInfo: factory.components.seasonInfo(actions),

        ...initMenuResource(factory.actions),
        ...logout,
        ...error,
    }
}
