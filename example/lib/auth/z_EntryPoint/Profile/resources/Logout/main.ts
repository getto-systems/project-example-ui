import { newClearAuthnInfoAction } from "../../../../sign/x_Action/AuthnInfo/Clear/main"

import { AuthProfileLogoutResource } from "./resource"

export function newAuthProfileLogoutResource(webStorage: Storage): AuthProfileLogoutResource {
    return {
        clear: newClearAuthnInfoAction(webStorage),
    }
}
