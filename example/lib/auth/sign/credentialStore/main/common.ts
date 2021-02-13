import { env } from "../../../../y_environment/env"

import { initWebTypedStorage } from "../../../../z_infra/storage/webStorage"

import { AuthCredentialStorage } from "../impl/repository/authCredential"
import { initApiCredentialConverter } from "../../../common/credential/impl/repository/converter"
import { initLastAuthAtConverter, initTicketNonceConverter } from "../impl/repository/converter"

export function initAuthCredentialStorage(credentialStorage: Storage): AuthCredentialStorage {
    return {
        ticketNonce: initWebTypedStorage(
            credentialStorage,
            env.storageKey.ticketNonce,
            initTicketNonceConverter()
        ),
        apiCredential: initWebTypedStorage(
            credentialStorage,
            env.storageKey.apiCredential,
            initApiCredentialConverter()
        ),
        lastAuthAt: initWebTypedStorage(
            credentialStorage,
            env.storageKey.lastAuthAt,
            initLastAuthAtConverter()
        ),
    }
}
