import { NonceValue, ApiRoles, RenewError } from "./data";

export type Infra = {
    credentials: CredentialRepository,
    renewClient: RenewClient,
}

export type TicketNonceFound =
    Readonly<{ found: false }> |
    Readonly<{ found: true, value: NonceValue }>
export const ticketNonceNotFound: TicketNonceFound = { found: false }
export function ticketNonceFound(nonce: NonceValue): TicketNonceFound {
    if (nonce.nonce === "") {
        return ticketNonceNotFound;
    }
    return { found: true, value: nonce }
}

export interface CredentialRepository {
    findNonce(): Promise<TicketNonceFound>
    storeRoles(roles: ApiRoles): Promise<void>
    storeNonce(nonce: NonceValue): Promise<void>
}

export interface RenewClient {
    renew(nonce: NonceValue): Promise<RenewResponse>
}

export type RenewResponse =
    Readonly<{ success: false, err: RenewError }> |
    Readonly<{ success: true, roles: ApiRoles }>
export function renewFailed(err: RenewError): RenewResponse {
    return { success: false, err }
}
export function renewSuccess(roles: ApiRoles): RenewResponse {
    return { success: true, roles }
}
