import { newRenewAuthnInfoAction } from "../../../../sign/x_Action/AuthnInfo/Renew/main"

import { RenewAuthInfoResource } from "./resource"

export function newRenewAuthInfoResource(webStorage: Storage): RenewAuthInfoResource {
    return {
        renew: newRenewAuthnInfoAction(webStorage),
    }
}
