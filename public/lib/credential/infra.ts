import { AuthCredential, TicketNonce, RenewError } from "./data"

export type Infra = Readonly<{
    timeConfig: TimeConfig,
    renewClient: RenewClient,
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
