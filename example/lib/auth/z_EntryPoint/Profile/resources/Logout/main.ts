import { newClearAuthCredentialAction } from "../../../../sign/x_Action/AuthCredential/Clear/main"

import { AuthProfileLogoutResource } from "./resource"

export function newAuthProfileLogoutResource(webStorage: Storage): AuthProfileLogoutResource {
    return {
        clear: newClearAuthCredentialAction(webStorage),
    }
}
