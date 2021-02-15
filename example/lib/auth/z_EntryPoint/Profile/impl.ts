import { ProfileFactory, ProfileResource } from "./entryPoint"

import { initErrorResource } from "../../../availability/x_Resource/Error/impl"
import { initClearCredentialResource } from "../../x_Resource/sign/ClearCredential/impl"
import { initMenuResource } from "../../../common/x_Resource/Outline/Menu/impl"

export function initProfileResource(factory: ProfileFactory): ProfileResource {
    const actions = {
        loadSeason: factory.actions.season.loadSeason(),
    }
    return {
        seasonInfo: factory.components.seasonInfo(actions),

        ...initErrorResource(factory.actions),
        ...initMenuResource(factory.actions),
        ...initClearCredentialResource(factory.actions),
    }
}
