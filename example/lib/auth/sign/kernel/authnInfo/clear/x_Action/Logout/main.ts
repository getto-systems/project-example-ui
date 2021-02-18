import { newClearAuthnInfoInfra } from "../../main"

import { initClearAuthnInfoAction } from "./impl"

import { LogoutAction } from "./action"

export function newClearAuthnInfoAction(webStorage: Storage): LogoutAction {
    return initClearAuthnInfoAction(newClearAuthnInfoInfra(webStorage))
}
