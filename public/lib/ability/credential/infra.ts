import { NonceValue, ApiRoles, RenewError } from "./data";

export type Infra = {
    credentials: CredentialRepository,
    renewClient: RenewClient,
}

export type NonceFound =
    Readonly<{ found: false }> |
    Readonly<{ found: true, value: NonceValue }>
export const nonceNotFound: NonceFound = { found: false }
export function nonceFound(nonce: NonceValue): NonceFound {
    if (nonce.nonce === "") {
        return nonceNotFound;
    }
    return { found: true, value: nonce }
}

export interface CredentialRepository {
    findNonce(): Promise<NonceFound>
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
