import { newApiCredentialRepository } from "../../../../common/auth/apiCredential/infra/repository/main"
import { newAuthCredentialRepository } from "../common/infra/repository/main"

import { initClearActionPod } from "./impl"

import { ClearActionPod } from "./action"

export function newClearActionPod(webStorage: Storage): ClearActionPod {
    return initClearActionPod({
        apiCredentials: newApiCredentialRepository(webStorage),
        authCredentials: newAuthCredentialRepository(webStorage),
    })
}
