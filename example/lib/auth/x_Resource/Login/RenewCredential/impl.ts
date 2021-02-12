import { initRenewComponent } from "./Renew/impl"

import { RenewComponent } from "./Renew/component"

import {
    RenewCredentialForegroundAction,
    RenewCredentialLocationInfo,
    RenewCredentialResource,
} from "./resource"

export function initRenewCredentialResource(
    setup: Setup<RenewComponent>,
    locationInfo: RenewCredentialLocationInfo,
    foreground: RenewCredentialForegroundAction
): RenewCredentialResource {
    const renew = initRenewComponent({
        renew: foreground.renew.renew(),
        forceRenew: foreground.renew.forceRenew(),
        setContinuousRenew: foreground.setContinuousRenew.setContinuousRenew(),
        secureScriptPath: foreground.application.secureScriptPath(locationInfo.application),
    })
    setup(renew)

    return {
        renew,
    }
}

interface Setup<T> {
    (component: T): void
}
