import { newClearAuthnInfoInfra } from "../../../kernel/authnInfo/clear/main"

import { initClearAuthnInfoAction } from "./impl"

import { ClearAuthnInfoAction } from "./action"

export function newClearAuthnInfoAction(webStorage: Storage): ClearAuthnInfoAction {
    return initClearAuthnInfoAction({
        clear: newClearAuthnInfoInfra(webStorage),
    })
}
