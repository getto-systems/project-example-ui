import { AuthCredential, LoginAt, StorageError, TicketNonce } from "./data"

export type StoreInfra = Readonly<{
    authCredentials: AuthCredentialRepository
}>

export interface AuthCredentialRepository {
    findTicketNonce(): FindResponse<TicketNonce>
    findLastLoginAt(): FindResponse<LoginAt>
    storeAuthCredential(authCredential: AuthCredential): StoreResponse
    removeAuthCredential(): StoreResponse
}

export type StorageKey = Readonly<{
    ticketNonce: string
    apiCredential: string
    lastLoginAt: string
}>

export type FindResponse<T> =
    | Readonly<{ success: false; err: StorageError }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: true; found: true; content: T }>

export type StoreResponse = Readonly<{ success: true }> | Readonly<{ success: false; err: StorageError }>
