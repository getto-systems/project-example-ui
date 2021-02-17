import {
    initMemoryTypedStorage,
    MemoryTypedStorageStore,
} from "../../../../../../../../z_infra/storage/memory"
import { initAuthnInfoRepository } from "./core"

import { AuthnInfoRepository } from "../../../infra"

import { AuthAt, AuthnNonce } from "../../../data"

export type AuthnInfoMemoryStore = Readonly<{
    authnNonce: MemoryTypedStorageStore<AuthnNonce>
    lastAuthAt: MemoryTypedStorageStore<AuthAt>
}>
export function initMemoryAuthnInfoRepository(
    storage: AuthnInfoMemoryStore
): AuthnInfoRepository {
    return initAuthnInfoRepository({
        authnNonce: initMemoryTypedStorage(storage.authnNonce),
        lastAuthAt: initMemoryTypedStorage(storage.lastAuthAt),
    })
}
