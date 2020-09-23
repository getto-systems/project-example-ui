import { AuthCredential, TicketNonce, RenewError, StoreError } from "./data"

export type Infra = Readonly<{
    timeConfig: TimeConfig,
    renewClient: RenewClient,
    authCredentials: AuthCredentialRepository,
}>

export type TimeConfig = Readonly<{
    renewDelayTime: DelayTime,
    renewIntervalTime: IntervalTime,
}>

export type DelayTime = Readonly<{ delay_milli_second: number }>
export type IntervalTime = Readonly<{ interval_milli_second: number }>

export interface RenewClient {
    renew(ticketNonce: TicketNonce): Promise<RenewResponse>
}

export type RenewResponse =
    Readonly<{ success: false, err: RenewError }> |
    Readonly<{ success: true, hasCredential: false }> |
    Readonly<{ success: true, hasCredential: true, authCredential: AuthCredential }>

export interface AuthCredentialRepository {
    findTicketNonce(): FindResponse
    storeAuthCredential(authCredential: AuthCredential): StoreResponse
}

export type FindResponse =
    Readonly<{ success: false, err: StoreError }> |
    Readonly<{ success: true, found: false }> |
    Readonly<{ success: true, found: true, ticketNonce: TicketNonce }>

export type StoreResponse =
    Readonly<{ success: false, err: StoreError }> |
    Readonly<{ success: true }>
