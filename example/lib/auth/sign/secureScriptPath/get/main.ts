import { env } from "../../../../y_environment/env"

import {
    initGetSecureScriptPathAction,
    initGetSecureScriptPathActionLocationInfo,
} from "./impl"

import {
    GetSecureScriptPathAction,
    GetSecureScriptPathActionLocationInfo,
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

export function newAuthLocationAction(): GetSecureScriptPathAction {
    return initGetSecureScriptPathAction(
        {
            config: {
                secureServerHost: env.secureServerHost,
            },
        },
        newGetSecureScriptPathActionLocationInfo()
    )
}

export function newGetSecureScriptPathActionLocationInfo(): GetSecureScriptPathActionLocationInfo {
    return initGetSecureScriptPathActionLocationInfo(currentURL())
}
