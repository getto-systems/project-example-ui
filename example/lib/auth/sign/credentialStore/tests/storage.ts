import { initMemoryTypedStorage, MemoryTypedStorageStore } from "../../../../z_infra/storage/memory"

import { AuthCredentialStorage } from "../impl/repository/authCredential"

import { ApiCredential, AuthAt, TicketNonce } from "../../../common/credential/data"

export type AuthCredentialStorageTestParam = Readonly<{
    ticketNonce: MemoryTypedStorageStore<TicketNonce>
    apiCredential: MemoryTypedStorageStore<ApiCredential>
    lastAuthAt: MemoryTypedStorageStore<AuthAt>
}>
export function initTestAuthCredentialStorage(
    params: AuthCredentialStorageTestParam
): AuthCredentialStorage {
    return {
        ticketNonce: initMemoryTypedStorage(params.ticketNonce),
        apiCredential: initMemoryTypedStorage(params.apiCredential),
        lastAuthAt: initMemoryTypedStorage(params.lastAuthAt),
    }
}
