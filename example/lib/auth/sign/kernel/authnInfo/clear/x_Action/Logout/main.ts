import { newClearAuthnInfoAction } from "./Core/main"

import { LogoutResource } from "./resource"

export function newLogoutResource(webStorage: Storage): LogoutResource {
    return {
        clear: newClearAuthnInfoAction(webStorage),
    }
}
