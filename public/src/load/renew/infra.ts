import { NonceValue, ApiRoles } from "../credential/data";

export type Infra = {
    renewClient: RenewClient,
}

export interface RenewClient {
    renew(nonce: NonceValue): Promise<Credential>;
}

export type Credential =
    Readonly<{ authorized: false }> |
    Readonly<{ authorized: true, roles: ApiRoles }>;

export const credentialUnauthorized: Credential = { authorized: false }
export function credentialAuthorized(roles: ApiRoles): Credential {
    return { authorized: true, roles: roles };
}
