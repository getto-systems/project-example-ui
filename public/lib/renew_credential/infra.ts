import { RenewCredentialError } from "./data"
import { AuthCredential, TicketNonce } from "../credential/data"

export type Infra = Readonly<{
    timeConfig: TimeConfig,
    renewClient: RenewClient,
}>

export type TimeConfig = Readonly<{
    renewDelayTime: DelayTime,
}>

export type DelayTime = Readonly<{ delay_milli_second: number }>

export interface RenewClient {
    renew(ticketNonce: TicketNonce): Promise<RenewResponse>
}

export type RenewResponse =
    Readonly<{ success: false, err: RenewCredentialError }> |
    Readonly<{ success: true, hasCredential: false }> |
    Readonly<{ success: true, hasCredential: true, authCredential: AuthCredential }>
