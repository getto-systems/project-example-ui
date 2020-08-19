import { NonceValue, ApiRoles, RenewError } from "../credential/data";

export type Infra = {
    renewClient: RenewClient,
}

export interface RenewClient {
    renew(nonce: NonceValue): Promise<Credential>;
}

export type Credential =
    Readonly<{ authorized: false, err: RenewError }> |
    Readonly<{ authorized: true, roles: ApiRoles }>;

export function credentialUnauthorized(err: RenewError): Credential {
    return { authorized: false, err: err }
}
export function credentialAuthorized(roles: ApiRoles): Credential {
    return { authorized: true, roles: roles };
}
