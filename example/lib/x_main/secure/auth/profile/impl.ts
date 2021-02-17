import { ProfileFactory, AuthProfileResource } from "./entryPoint"

import { initErrorResource } from "../../../../availability/x_Resource/Error/impl"
import { initMenuResource } from "../../../../common/x_Resource/Outline/Menu/impl"

import { LogoutResource } from "../../../../auth/sign/kernel/authnInfo/clear/x_Action/Logout/action"

export function initAuthProfileResource(
    factory: ProfileFactory,
    resource: LogoutResource
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
