import { AuthState, FetchError, StoreError } from "./usecase"

import { RenewCredentialParamPacker } from "./component/renew_credential/component"
import { LoadApplicationParamPacker } from "./component/load_application/component"
import { PasswordResetParamPacker } from "./component/password_reset/component"

import { AuthCredential, TicketNonce } from "../credential/data"
import { PagePathname } from "../script/data"

export type Infra = Readonly<{
    param: AuthParam
    authLocation: AuthLocation
    authCredentials: AuthCredentialRepository
}>

export type AuthParam = Readonly<{
    renewCredential: RenewCredentialParamPacker
    loadApplication: LoadApplicationParamPacker
    passwordReset: PasswordResetParamPacker
}>

export interface AuthLocation {
    detect(param: AuthParam): AuthState
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
