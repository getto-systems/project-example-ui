import { ProfileFactory, AuthProfileResource } from "./entryPoint"

import { initErrorResource } from "../../../availability/x_Resource/Error/impl"
import { initAuthProfileLogoutResource } from "./resources/Logout/impl"
import { initMenuResource } from "../../../common/x_Resource/Outline/Menu/impl"

export function initAuthProfileResource(factory: ProfileFactory): AuthProfileResource {
    const actions = {
        loadSeason: factory.actions.season.loadSeason(),
    }
    return {
        seasonInfo: factory.components.seasonInfo(actions),

        ...initErrorResource(factory.actions),
        ...initMenuResource(factory.actions),
        ...initAuthProfileLogoutResource(factory.actions),
    }
}
