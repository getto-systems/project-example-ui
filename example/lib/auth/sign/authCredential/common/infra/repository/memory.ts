import {
    initMemoryTypedStorage,
    MemoryTypedStorageStore,
} from "../../../../../../z_infra/storage/memory"
import { initAuthCredentialRepository } from "./authCredential"

import { AuthCredentialRepository } from "../../infra"

import { AuthAt, TicketNonce } from "../../data"

export type AuthCredentialMemoryStore = Readonly<{
    ticketNonce: MemoryTypedStorageStore<TicketNonce>
    lastAuthAt: MemoryTypedStorageStore<AuthAt>
}>
export function initMemoryAuthCredentialRepository(
    storage: AuthCredentialMemoryStore
): AuthCredentialRepository {
    return initAuthCredentialRepository({
        ticketNonce: initMemoryTypedStorage(storage.ticketNonce),
        lastAuthAt: initMemoryTypedStorage(storage.lastAuthAt),
    })
}
