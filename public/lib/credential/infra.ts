import { AuthCredential, TicketNonce, RenewError } from "./data"

export type Infra = Readonly<{
    timeConfig: TimeConfig
    renewClient: RenewClient
    delayed: Delayed
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

export interface Delayed {
    <T>(promise: Promise<T>, time: DelayTime, handler: DelayedHandler): Promise<T>
}

interface DelayedHandler {
    (): void
}
