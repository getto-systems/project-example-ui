import { AuthCredential, TicketNonce, StoreError } from "./data"

export type Infra = Readonly<{
    authCredentials: AuthCredentialRepository,
}>

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
