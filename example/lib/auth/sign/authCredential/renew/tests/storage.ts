import { initMemoryTypedStorage, MemoryTypedStorageStore } from "../../../../../z_infra/storage/memory"

import { AuthCredentialStorage } from "../infra/repository/authCredential"

import { AuthAt, TicketNonce } from "../data"

export type AuthCredentialStorageTestParam = Readonly<{
    ticketNonce: MemoryTypedStorageStore<TicketNonce>
    lastAuthAt: MemoryTypedStorageStore<AuthAt>
}>
export function initTestAuthCredentialStorage(
    params: AuthCredentialStorageTestParam
): AuthCredentialStorage {
    return {
        ticketNonce: initMemoryTypedStorage(params.ticketNonce),
        lastAuthAt: initMemoryTypedStorage(params.lastAuthAt),
    }
}
