import { env } from "../../../../../y_environment/env"

import { initWebTypedStorage } from "../../../../../z_infra/storage/webStorage"

import { AuthCredentialStorage } from "../infra/repository/authCredential"
import { initLastAuthAtConverter, initTicketNonceConverter } from "../infra/repository/converter"

export function initAuthCredentialStorage(credentialStorage: Storage): AuthCredentialStorage {
    return {
        ticketNonce: initWebTypedStorage(
            credentialStorage,
            env.storageKey.ticketNonce,
            initTicketNonceConverter()
        ),
        lastAuthAt: initWebTypedStorage(
            credentialStorage,
            env.storageKey.lastAuthAt,
            initLastAuthAtConverter()
        ),
    }
}
