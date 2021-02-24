import { newApiCredentialRepository } from "../../../../../common/apiCredential/infra/repository/main"
import { newAuthnInfoRepository } from "../kernel/infra/repository/authnInfo/init"

import { ClearInfra } from "./infra"

export function newClearInfra(webStorage: Storage): ClearInfra {
    return {
        apiCredentials: newApiCredentialRepository(webStorage),
        authnInfos: newAuthnInfoRepository(webStorage),
    }
}
