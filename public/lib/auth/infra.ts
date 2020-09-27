import { AuthState, FetchError, StoreError } from "./usecase"

import { RenewCredentialParamPacker } from "./component/renew_credential/component"
import { LoadApplicationParamPacker } from "./component/load_application/component"
import { PasswordResetParamPacker } from "./component/password_reset/component"

import { AuthCredential, TicketNonce, AuthAt } from "../credential/data"
import { PagePathname } from "../script/data"

export type Infra = Readonly<{
    timeConfig: TimeConfig
    param: AuthParam
    authLocation: AuthLocation
    authCredentials: AuthCredentialRepository
    expires: AuthExpires
    runner: RenewRunner
}>

export type TimeConfig = Readonly<{
    instantLoadExpireTime: ExpireTime
    renewRunDelayTime: DelayTime
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
    findLastAuthAt(): FindResponse<AuthAt>
    storeAuthCredential(authCredential: AuthCredential): StoreResponse
}

export interface AuthExpires {
    hasExceeded(lastAuthAt: Found<AuthAt>, expire: ExpireTime): boolean
}

export interface RenewRunner {
    nextRun(lastAuthAt: Found<AuthAt>, delay: DelayTime): DelayTime
}

type ExpireTime = Readonly<{ expire_milli_second: number }>
type DelayTime = Readonly<{ delay_milli_second: number }>

export type StorageKey = Readonly<{
    ticketNonce: string
    apiCredential: string
    lastAuthAt: string
}>

export type FindResponse<T> =
    Readonly<{ success: false, err: FetchError }> |
    Readonly<{ success: true, found: false }> |
    Readonly<{ success: true, found: true, content: T }>

export type StoreResponse =
    Readonly<{ success: true }> |
    Readonly<{ success: false, err: StoreError }>

export type Found<T> =
    Readonly<{ found: false }> |
    Readonly<{ found: true, content: T }>
