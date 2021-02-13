import { initRenewComponent } from "./Renew/impl"

import {
    RenewCredentialForegroundActionPod,
    RenewCredentialLocationInfo,
    RenewCredentialResource,
} from "./resource"

import { RenewMaterial } from "./Renew/component"
import { initRenewAction } from "../../../sign/authCredential/renew/impl"
import { initContinuousRenewAction } from "../../../sign/authCredential/continuousRenew/impl"

export function initRenewCredentialResource(
    locationInfo: RenewCredentialLocationInfo,
    foreground: RenewCredentialForegroundActionPod
): RenewCredentialResource {
    return {
        renew: initRenewComponent(renewMaterial()),
    }

    function renewMaterial(): RenewMaterial {
        return {
            renew: initRenewAction(foreground.initRenew),
            continuousRenew: initContinuousRenewAction(foreground.initContinuousRenew),

            secureScriptPath: foreground.application.secureScriptPath(locationInfo.application),
        }
    }
}
