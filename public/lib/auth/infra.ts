import { FetchError, StoreError } from "./usecase"

import { AuthCredential, TicketNonce } from "../credential/data"

export type Infra = Readonly<{
    authCredentials: AuthCredentialRepository
}>

export interface AuthCredentialRepository {
    findTicketNonce(): FindResponse<TicketNonce>
    storeAuthCredential(authCredential: AuthCredential): StoreResponse
}

export type StorageKey = Readonly<{
    ticketNonce: string
    apiCredential: string
}>

export type FindResponse<T> =
    Readonly<{ success: false, err: FetchError }> |
    Readonly<{ success: true, found: false }> |
    Readonly<{ success: true, found: true, content: T }>

export type StoreResponse =
    Readonly<{ success: true }> |
    Readonly<{ success: false, err: StoreError }>
