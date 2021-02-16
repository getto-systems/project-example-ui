import { initRenewAuthCredentialComponent } from "../../../../sign/x_Action/AuthCredential/Renew/impl"

import { AuthSignRenewMaterial, AuthSignRenewResource } from "./resource"

export function initAuthSignRenewResource(material: AuthSignRenewMaterial): AuthSignRenewResource {
    return {
        renew: initRenewAuthCredentialComponent(material),
    }
}
