import { env } from "../../../y_environment/env"

import { initLocationAction, initLocationActionLocationInfo } from "./impl"

import { LocationAction, LocationActionLocationInfo } from "./action"
import { currentURL } from "../../../z_infra/location/url"

export function newLocationAction(): LocationAction {
    return initLocationAction(newLocationActionLocationInfo(), {
        config: {
            secureServerHost: env.secureServerHost,
        },
    })
}

function newLocationActionLocationInfo(): LocationActionLocationInfo {
    return initLocationActionLocationInfo(currentURL())
}
