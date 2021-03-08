import { env } from "../../../../../../y_environment/env"
import { newLocationDetecter } from "../../../../../../z_vendor/getto-application/location/init"

import { detectPathname } from "./core"
import { GetScriptPathInfra } from "../infra"

import { GetScriptPathLocationDetecter } from "../method"

export function newGetScriptPathLocationDetecter(
    currentLocation: Location,
): GetScriptPathLocationDetecter {
    return newLocationDetecter(currentLocation, detectPathname)
}

export function newGetSecureScriptPathInfra(): GetScriptPathInfra {
    return {
        config: {
            secureServerURL: env.secureServerURL,
        },
    }
}
