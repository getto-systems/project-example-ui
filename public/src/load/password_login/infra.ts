import { NonceValue, ApiRoles, LoginError } from "../credential/data";
import { Password } from "./data";

export type Infra = {
    passwordLoginClient: PasswordLoginClient,
}

export interface PasswordLoginClient {
    login(password: Password): Promise<Credential>;
}

export type Credential =
    Readonly<{ authorized: false, err: LoginError }> |
    Readonly<{ authorized: true, nonce: NonceValue, roles: ApiRoles }>;

export function credentialUnauthorized(err: LoginError): Credential {
    return { authorized: false, err: err }
}
export function credentialAuthorized(nonce: NonceValue, roles: ApiRoles): Credential {
    return { authorized: true, nonce: nonce, roles: roles }
}
