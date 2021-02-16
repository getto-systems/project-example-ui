import { newRenewAuthnInfoAction } from "../../../../sign/x_Action/AuthnInfo/Renew/main"

import { AuthSignRenewResource } from "./resource"

export function newAuthSignRenewResource(webStorage: Storage): AuthSignRenewResource {
    return {
        renew: newRenewAuthnInfoAction(webStorage),
    }
}
