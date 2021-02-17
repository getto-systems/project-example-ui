import { newApiCredentialRepository } from "../../../../../common/apiCredential/infra/repository/main"
import { newAuthnInfoRepository } from "../kernel/infra/repository/authnInfo/main"

import { ClearAuthnInfoInfra } from "./infra"

export function newClearAuthnInfoInfra(webStorage: Storage): ClearAuthnInfoInfra {
    return {
        apiCredentials: newApiCredentialRepository(webStorage),
        authnInfos: newAuthnInfoRepository(webStorage),
    }
}
