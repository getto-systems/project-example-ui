import { AuthCredential, TicketNonce, RenewError } from "./data";

export type Infra = {
    authCredentials: AuthCredentialRepository,
    renewClient: RenewClient,
}

export type TicketNonceFound =
    Readonly<{ found: false }> |
    Readonly<{ found: true, ticketNonce: TicketNonce }>
export const ticketNonceNotFound: TicketNonceFound = { found: false }
export function ticketNonceFound(ticketNonce: TicketNonce): TicketNonceFound {
    if (ticketNonce.ticketNonce === "") {
        return ticketNonceNotFound;
    }
    return { found: true, ticketNonce }
}

export interface AuthCredentialRepository {
    findTicketNonce(): Promise<TicketNonceFound>
    // TODO
    //findApiNonce(): Promise<ApiNonceFound>
    storeAuthCredential(authCredential: AuthCredential): Promise<void>
}

export interface RenewClient {
    renew(ticketNonce: TicketNonce): Promise<RenewResponse>
}

export type RenewResponse =
    Readonly<{ success: false, err: RenewError }> |
    Readonly<{ success: true, authCredential: AuthCredential }>
export function renewFailed(err: RenewError): RenewResponse {
    return { success: false, err }
}
export function renewSuccess(authCredential: AuthCredential): RenewResponse {
    return { success: true, authCredential }
}
