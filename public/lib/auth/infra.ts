import { AuthState, FetchError, StoreError } from "./usecase"

import { AuthCredential, TicketNonce } from "../credential/data"
import { PagePathname } from "../script/data"

export type Infra = Readonly<{
    authLocation: AuthLocation
    authCredentials: AuthCredentialRepository
}>

export interface AuthLocation {
    detect(): AuthState
    currentPagePathname(): PagePathname
}

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
