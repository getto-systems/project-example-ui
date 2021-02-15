import { initRenewComponent } from "./Renew/impl"

import { RenewAuthCredentialForegroundAction, AuthSignAuthCredentialClearResource } from "./resource"

export function initRenewCredentialResource(
    foreground: RenewAuthCredentialForegroundAction
): AuthSignAuthCredentialClearResource {
    return {
        renew: initRenewComponent({foreground}),
    }
}
