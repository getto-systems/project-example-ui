import { env } from "../../../../y_environment/env"

import { initGetSecureScriptPathAction, initGetSecureScriptPathActionLocationInfo } from "./impl"

import { GetSecureScriptPathAction, GetSecureScriptPathActionLocationInfo } from "./action"
import { currentURL } from "../../../../z_infra/location/url"

export function newAuthLocationAction(): GetSecureScriptPathAction {
    return initGetSecureScriptPathAction(
        {
            config: {
                secureServerHost: env.secureServerHost,
            },
        },
        newLocationInfo()
    )
}

function newLocationInfo(): GetSecureScriptPathActionLocationInfo {
    return initGetSecureScriptPathActionLocationInfo(currentURL())
}
