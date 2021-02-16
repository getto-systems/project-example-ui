import { newClearAuthCredentialInfra } from "../../../authCredential/clear/main"

import { initClearAuthCredentialAction } from "./impl"

import { ClearAuthCredentialAction } from "./action"

export function newClearAuthCredentialAction(
    webStorage: Storage
): ClearAuthCredentialAction {
    return initClearAuthCredentialAction({
        clear: newClearAuthCredentialInfra(webStorage),
    })
}
