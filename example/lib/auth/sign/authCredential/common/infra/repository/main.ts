import { env } from "../../../../../../y_environment/env"

import { initWebTypedStorage } from "../../../../../../z_infra/storage/webStorage"
import { initAuthCredentialRepository } from "./authCredential"
import { initLastAuthAtConverter, initTicketNonceConverter } from "./converter"

import { AuthCredentialRepository } from "../../infra"

export function newAuthCredentialRepository(webStorage: Storage): AuthCredentialRepository {
    return initAuthCredentialRepository({
        ticketNonce: initWebTypedStorage(
            webStorage,
            env.storageKey.ticketNonce,
            initTicketNonceConverter()
        ),
        lastAuthAt: initWebTypedStorage(
            webStorage,
            env.storageKey.lastAuthAt,
            initLastAuthAtConverter()
        ),
    })
}
