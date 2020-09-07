import { LoginID, AuthCredential } from "../auth_credential/data";
import { Password } from "../password/data";

export type Infra = {
    passwordLoginClient: PasswordLoginClient,
}

export interface PasswordLoginClient {
    login(loginID: LoginID, password: Password): Promise<LoginResponse>
}

export type LoginResponse =
    Readonly<{ success: false, err: LoginError }> |
    Readonly<{ success: true, authCredential: AuthCredential }>
export function loginFailed(err: LoginError): LoginResponse {
    return { success: false, err }
}
export function loginSuccess(authCredential: AuthCredential): LoginResponse {
    return { success: true, authCredential }
}

export type LoginError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-login" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
