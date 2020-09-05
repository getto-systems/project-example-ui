import { Nonce, NonceValue, ApiRoles, RenewError } from "./data";

export type Infra = {
    credentials: CredentialRepository,
    renewClient: RenewClient,
}

export interface CredentialRepository {
    findNonce(): Promise<Nonce>
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
