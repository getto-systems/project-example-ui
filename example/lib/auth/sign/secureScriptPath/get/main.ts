import { env } from "../../../../y_environment/env"

import { currentURL } from "../../../../z_infra/location/url"

import { initGetSecureScriptPathLocationInfo } from "./impl"

import { GetSecureScriptPathInfra } from "./infra"

import { GetSecureScriptPathLocationInfo } from "./method"

export function newGetSecureScriptPathInfra(): GetSecureScriptPathInfra {
    return {
        config: {
            secureServerHost: env.secureServerHost,
        },
    }
}

export function newGetSecureScriptPathLocationInfo(): GetSecureScriptPathLocationInfo {
    return initGetSecureScriptPathLocationInfo(currentURL())
}
