export type Auth =
    Readonly<{ authorized: true }> |
    Readonly<{ authorized: false }>;

export const authorized: Auth = { authorized: true }
export const unauthorized: Auth = { authorized: false }

export type NonceValue = Readonly<string>;

export type ApiRoles = Readonly<Array<string>>;
export function apiRoles(roles: Array<string>): ApiRoles {
    return roles;
}

export type Nonce =
    Readonly<{ found: false }> |
    Readonly<{ found: true, value: NonceValue }>;

export const nonceNotFound: Nonce = { found: false }
export function nonce(nonce: NonceValue): Nonce {
    return { found: true, value: nonce };
}

export type Credential =
    Readonly<{ authorized: false }> |
    Readonly<{ authorized: true, roles: ApiRoles }>;

export const credentialUnauthorized: Credential = { authorized: false }
export function credentialAuthorized(roles: ApiRoles): Credential {
    return { authorized: true, roles: roles };
}

export type Success = Readonly<true>;
export const success: Success = true
