import { AuthCredential, TicketNonce, StoreError, RenewError } from "./data"

export type Infra = Readonly<{
    config: Config,
    authCredentials: AuthCredentialRepository,
    renewClient: RenewClient,
}>

export type Config = Readonly<{
    renewDelayTime: DelayTime,
}>

export type DelayTime = Readonly<{ delay_milli_second: number }>

export interface AuthCredentialRepository {
    findTicketNonce(): FindResponse
    // TODO find api nonce を追加
    //findApiNonce(): ApiNonceFound
    storeAuthCredential(authCredential: AuthCredential): StoreResponse
}

export type FindResponse =
    Readonly<{ success: false, err: StoreError }> |
    Readonly<{ success: true, found: false }> |
    Readonly<{ success: true, found: true, ticketNonce: TicketNonce }>

export type StoreResponse =
    Readonly<{ success: false, err: StoreError }> |
    Readonly<{ success: true }>

export interface RenewClient {
    renew(ticketNonce: TicketNonce): Promise<RenewResponse>
}

export type RenewResponse =
    Readonly<{ success: false, err: RenewError }> |
    Readonly<{ success: true, hasCredential: false }> |
    Readonly<{ success: true, hasCredential: true, authCredential: AuthCredential }>
