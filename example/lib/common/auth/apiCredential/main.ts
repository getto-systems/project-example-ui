import { env } from "../../../y_environment/env"

import { initWebTypedStorage } from "../../../z_infra/storage/webStorage"
import { initApiCredentialConverter } from "./infra/repository/converter"
import { initApiCredentialRepository } from "./infra/repository/apiCredential"

import { ApiCredentialRepository } from "./infra"

export function newApiCredentialRepository(webStorage: Storage): ApiCredentialRepository {
    return initApiCredentialRepository({
        apiCredential: initWebTypedStorage(
            webStorage,
            env.storageKey.apiCredential,
            initApiCredentialConverter()
        ),
    })
}
