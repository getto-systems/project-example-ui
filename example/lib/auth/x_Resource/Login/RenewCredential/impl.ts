import { initRenewComponent } from "./Renew/impl"

import {
    RenewCredentialForegroundAction,
    RenewCredentialLocationInfo,
    RenewCredentialResource,
} from "./resource"

export function initRenewCredentialResource(
    locationInfo: RenewCredentialLocationInfo,
    foreground: RenewCredentialForegroundAction
): RenewCredentialResource {
    const renew = initRenewComponent({
        renew: foreground.renew.renew(),
        forceRenew: foreground.renew.forceRenew(),
        setContinuousRenew: foreground.setContinuousRenew.setContinuousRenew(),
        secureScriptPath: foreground.application.secureScriptPath(locationInfo.application),
    })

    return {
        renew,
    }
}
