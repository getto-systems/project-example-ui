import { initRenewComponent } from "./Renew/impl"

import {
    RenewCredentialForegroundAction,
    RenewCredentialLocationInfo,
    RenewCredentialResource,
} from "./resource"

import { RenewMaterial } from "./Renew/component"

export function initRenewCredentialResource(
    locationInfo: RenewCredentialLocationInfo,
    foreground: RenewCredentialForegroundAction
): RenewCredentialResource {
    return {
        renew: initRenewComponent(renew()),
    }

    function renew(): RenewMaterial {
        return {
            renew: foreground.renew.renew(),
            forceRenew: foreground.renew.forceRenew(),
            setContinuousRenew: foreground.setContinuousRenew.setContinuousRenew(),
            secureScriptPath: foreground.application.secureScriptPath(locationInfo.application),
        }
    }
}
