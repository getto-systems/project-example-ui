import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import { newAuthCredentialRepository } from "../common/infra/repository/main"

import { initClearAction } from "./impl"

import { ClearAction } from "./action"

export function newClearAction(webStorage: Storage): ClearAction {
    return initClearAction({
        apiCredentials: newApiCredentialRepository(webStorage),
        authCredentials: newAuthCredentialRepository(webStorage),
    })
}
