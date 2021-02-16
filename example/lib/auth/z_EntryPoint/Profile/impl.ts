import { ProfileFactory, AuthProfileResource } from "./entryPoint"

import { initErrorResource } from "../../../availability/x_Resource/Error/impl"
import { initMenuResource } from "../../../common/x_Resource/Outline/Menu/impl"

import { AuthProfileLogoutResource } from "./resources/Logout/resource"

export function initAuthProfileResource(
    factory: ProfileFactory,
    resource: AuthProfileLogoutResource
): AuthProfileResource {
    const actions = {
        loadSeason: factory.actions.season.loadSeason(),
    }
    return {
        seasonInfo: factory.components.seasonInfo(actions),

        ...initErrorResource(factory.actions),
        ...initMenuResource(factory.actions),
        ...resource,
    }
}
