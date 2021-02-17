import { newClearAuthnInfoAction } from "../../../sign/x_Action/AuthnInfo/Clear/main"

import { LogoutResource } from "./resource"

export function newLogoutResource(webStorage: Storage): LogoutResource {
    return {
        clear: newClearAuthnInfoAction(webStorage),
    }
}
