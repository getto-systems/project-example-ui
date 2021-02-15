import { initRenewComponent } from "./Renew/impl"

import {
    RenewCredentialForegroundAction,
    RenewCredentialLocationInfo,
    RenewCredentialResource,
} from "./resource"

import { RenewMaterial } from "./Renew/component"
import { initLocationAction } from "../../../sign/location/impl"

export function initRenewCredentialResource(
    locationInfo: RenewCredentialLocationInfo,
    foreground: RenewCredentialForegroundAction
): RenewCredentialResource {
    return {
        renew: initRenewComponent(renewMaterial()),
    }

    function renewMaterial(): RenewMaterial {
        return {
            ...foreground,
            location: initLocationAction(foreground.initLocation, locationInfo),
        }
    }
}
