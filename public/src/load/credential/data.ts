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

export interface Renewer {
    (nonce: NonceValue): Promise<Renewed>;
}

export type Renewed =
    Readonly<{ renewed: false }> |
    Readonly<{ renewed: true, roles: ApiRoles }>;
export const renewFailed: Renewed = { renewed: false };
export function renewSuccess(roles: ApiRoles): Renewed {
    return { renewed: true, roles: roles }
}

export type Authorized =
    Readonly<{ authorized: false }> |
    Readonly<{ authorized: true }>;
export const unauthorized: Authorized = { authorized: false }
export const authorized: Authorized = { authorized: true }
