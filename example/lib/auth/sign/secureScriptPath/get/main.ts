import { env } from "../../../../y_environment/env"

import {
    initGetSecureScriptPathAction_legacy,
    initGetSecureScriptPathLocationInfo,
} from "./impl"

import {
    GetSecureScriptPathAction_legacy,
    GetSecureScriptPathLocationInfo,
} from "./action"
import { currentURL } from "../../../../z_infra/location/url"
import { GetSecureScriptPathInfra } from "./infra"

export type _GetSecureScriptPathInfra = Readonly<{
    config: Readonly<{
        secureServerHost: string
    }>
}>

export function newGetSecureScriptPathInfra(): GetSecureScriptPathInfra {
    return {
        config: {
            secureServerHost: env.secureServerHost,
        },
    }
}

export function newAuthLocationAction_legacy(): GetSecureScriptPathAction_legacy {
    return initGetSecureScriptPathAction_legacy(
        {
            config: {
                secureServerHost: env.secureServerHost,
            },
        },
        newGetSecureScriptPathLocationInfo()
    )
}

export function newGetSecureScriptPathLocationInfo(): GetSecureScriptPathLocationInfo {
    return initGetSecureScriptPathLocationInfo(currentURL())
}
