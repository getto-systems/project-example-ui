import { env } from "../../../../../../../../y_environment/env"

import { initWebTypedStorage } from "../../../../../../../../z_getto/storage/typed/web"
import { initAuthnInfoRepository } from "./core"
import { initLastAuthAtConverter, initAuthnNonceConverter } from "./converter"

import { AuthnInfoRepository } from "../../../infra"

export function newAuthnInfoRepository(webStorage: Storage): AuthnInfoRepository {
    return initAuthnInfoRepository({
        authnNonce: initWebTypedStorage(
            webStorage,
            env.storageKey.authnNonce,
            initAuthnNonceConverter()
        ),
        lastAuthAt: initWebTypedStorage(
            webStorage,
            env.storageKey.lastAuthAt,
            initLastAuthAtConverter()
        ),
    })
}
