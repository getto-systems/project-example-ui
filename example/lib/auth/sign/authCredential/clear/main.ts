import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import { newAuthCredentialRepository } from "../common/infra/repository/authCredential/main"

import { initClearAuthCredentialAction } from "./impl"

import { ClearAuthCredentialAction } from "./action"

export function newClearAuthCredentialAction(webStorage: Storage): ClearAuthCredentialAction {
    return initClearAuthCredentialAction({
        apiCredentials: newApiCredentialRepository(webStorage),
        authCredentials: newAuthCredentialRepository(webStorage),
    })
}
