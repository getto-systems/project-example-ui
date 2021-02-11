import { initRenewCredentialComponent } from "./renew"

import { RenewCredentialComponent } from "../component"

import {
    RenewCredentialForegroundAction,
    RenewCredentialLocationInfo,
    RenewCredentialResource,
} from "../resource"

export function initRenewCredentialResource(
    setup: Setup<RenewCredentialComponent>,
    locationInfo: RenewCredentialLocationInfo,
    foreground: RenewCredentialForegroundAction
): RenewCredentialResource {
    const renew = initRenewCredentialComponent({
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
