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

export type Authorized<T> =
    Readonly<{ authorized: false, err: T }> |
    Readonly<{ authorized: true }>;
export function unauthorized<T>(err: T): Authorized<T> {
    return { authorized: false, err: err }
}
export function authorized<T>(): Authorized<T> {
    return { authorized: true }
}

export interface Renewer {
    (nonce: NonceValue): Promise<Renew>;
}

export type Renew =
    Readonly<{ renew: false, err: RenewError }> |
    Readonly<{ renew: true, roles: ApiRoles }>;
export function renewFailed(err: RenewError): Renew {
    return { renew: false, err: err }
}
export function renewSuccess(roles: ApiRoles): Renew {
    return { renew: true, roles: roles }
}

export type RenewError =
    Readonly<"timeout"> |
    Readonly<"unauthorized"> |
    Readonly<"empty-nonce">;

export interface Loginer {
    (): Promise<Login>;
}

export type Login =
    Readonly<{ login: false, err: LoginError }> |
    Readonly<{ login: true, nonce: NonceValue, roles: ApiRoles }>;
export function loginFailed(err: LoginError): Login {
    return { login: false, err: err }
}
export function loginSuccess(nonce: NonceValue, roles: ApiRoles): Login {
    return { login: true, nonce: nonce, roles: roles }
}

export type LoginError =
    Readonly<"timeout"> |
    Readonly<"match-failed"> |
    Readonly<"empty-input">;
