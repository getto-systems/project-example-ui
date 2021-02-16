import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import { newAuthCredentialRepository } from "../common/infra/repository/authCredential/main"

import { ClearAuthCredentialInfra } from "./infra"

export function newClearAuthCredentialInfra(webStorage: Storage): ClearAuthCredentialInfra {
    return {
        apiCredentials: newApiCredentialRepository(webStorage),
        authCredentials: newAuthCredentialRepository(webStorage),
    }
}
