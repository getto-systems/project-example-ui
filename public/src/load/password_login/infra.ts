import { Nonce, NonceValue, ApiRoles } from "../credential/data";

export type Infra = {
    loginClient: LoginClient,
    credentials: CredentialRepository,
}

export interface LoginClient {
    login(nonce: NonceValue): Promise<Credential>;
}

export interface CredentialRepository {
    findNonce(): Promise<Nonce>;
    storeRoles(roles: ApiRoles): Promise<Success>;
}

export type Credential =
    Readonly<{ authorized: false }> |
    Readonly<{ authorized: true, nonce: NonceValue, roles: ApiRoles }>;

export const credentialUnauthorized: Credential = { authorized: false }
export function credentialAuthorized(nonce: NonceValue, roles: ApiRoles): Credential {
    return { authorized: true, nonce: nonce, roles: roles };
}

export type Success = Readonly<true>;
export const success: Success = true
