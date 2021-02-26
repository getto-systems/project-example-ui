import { initMemoryTypedStorage, MemoryTypedStorageStore } from "../../../../z_vendor/getto-application/storage/typed/memory"
import { initApiCredentialRepository } from "./apiCredential"

import { ApiCredentialRepository } from "../../infra"

import { ApiCredential } from "../../data"

export function initMemoryApiCredentialRepository(
    store: MemoryTypedStorageStore<ApiCredential>
): ApiCredentialRepository {
    return initApiCredentialRepository({
        apiCredential: initMemoryTypedStorage(store),
    })
}
