import { LoginID, Nonce, ApiRoles } from "../credential/data";
import { Password } from "../password/data";

export type Infra = {
    passwordLoginClient: PasswordLoginClient,
}

export interface PasswordLoginClient {
    login(loginID: LoginID, password: Password): Promise<LoginResponse>
}

export type LoginResponse =
    Readonly<{ success: false, err: LoginError }> |
    Readonly<{ success: true, nonce: Nonce, roles: ApiRoles }>
export function loginFailed(err: LoginError): LoginResponse {
    return { success: false, err }
}
export function loginSuccess(nonce: Nonce, roles: ApiRoles): LoginResponse {
    return { success: true, nonce, roles }
}

export type LoginError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-login" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
