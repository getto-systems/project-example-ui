import { env } from "../../../../y_environment/env"

import { initWebTypedStorage } from "../../../../z_vendor/getto-application/storage/typed/web"
import { initApiCredentialConverter } from "./converter"
import { initApiCredentialRepository } from "./apiCredential"

import { ApiCredentialRepository } from "../../infra"

export function newApiCredentialRepository(webStorage: Storage): ApiCredentialRepository {
    return initApiCredentialRepository({
        apiCredential: initWebTypedStorage(
            webStorage,
            env.storageKey.apiCredential,
            initApiCredentialConverter()
        ),
    })
}
