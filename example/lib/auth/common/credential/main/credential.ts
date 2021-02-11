import { env } from "../../../../y_environment/env"

import { initWebTypedStorage } from "../../../../z_infra/storage/webStorage"

import { initApiCredentialRepository } from "../impl/repository/apiCredential"
import { initApiCredentialConverter } from "../impl/repository/converter"

import { loadApiNonce, loadApiRoles } from "../impl/core"

import { CredentialAction } from "../action"

export function initCredentialAction(credentialStorage: Storage): CredentialAction {
    const apiCredentials = initApiCredentialRepository({
        apiCredential: initWebTypedStorage(
            credentialStorage,
            env.storageKey.apiCredential,
            initApiCredentialConverter()
        ),
    })

    return {
        loadApiNonce: loadApiNonce({ apiCredentials }),
        loadApiRoles: loadApiRoles({ apiCredentials }),
    }
}
