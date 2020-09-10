import { AuthCredential, TicketNonce, StoreError, RenewError } from "./data";

export type Infra = {
    authCredentials: AuthCredentialRepository,
    renewClient: RenewClient,
}

export interface AuthCredentialRepository {
    findTicketNonce(): FindResponse<TicketNonce>
    // TODO
    //findApiNonce(): ApiNonceFound
    storeAuthCredential(authCredential: AuthCredential): StoreResponse
}

export type FindResponse<T> =
    Readonly<{ success: false, err: StoreError }> |
    Readonly<{ success: true, found: false }> |
    Readonly<{ success: true, found: true, content: T }>

export type StoreResponse =
    Readonly<{ success: false, err: StoreError }> |
    Readonly<{ success: true }>

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
