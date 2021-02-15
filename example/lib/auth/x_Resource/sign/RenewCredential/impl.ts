import { initRenewComponent } from "./Renew/impl"

import { RenewCredentialForegroundAction, RenewCredentialResource } from "./resource"

export function initRenewCredentialResource(
    foreground: RenewCredentialForegroundAction
): RenewCredentialResource {
    return {
        renew: initRenewComponent(foreground),
    }
}
