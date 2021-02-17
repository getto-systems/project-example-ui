import { newClearAuthnInfoInfra } from "../../main"

import { initClearAuthnInfoAction } from "./impl"

import { LogoutAction } from "./action"

export function newClearAuthnInfoAction(webStorage: Storage): LogoutAction {
    return initClearAuthnInfoAction({
        clear: newClearAuthnInfoInfra(webStorage),
    })
}
