import { ProfileFactory, ProfileLocationInfo, ProfileResource } from "./entryPoint"

import { initClearCredentialResource } from "../../x_Resource/Sign/ClearCredential/impl"
import { initMenuResource } from "../../../common/x_Resource/Outline/Menu/impl"

export function initProfileResource(
    factory: ProfileFactory,
    locationInfo: ProfileLocationInfo
): ProfileResource {
    const actions = {
        notify: factory.actions.notify.notify(),
        loadSeason: factory.actions.season.loadSeason(),
    }
    return {
        error: factory.components.error(actions),
        seasonInfo: factory.components.seasonInfo(actions),

        ...initMenuResource(locationInfo, factory.actions),
        ...initClearCredentialResource(factory.actions),
    }
}
