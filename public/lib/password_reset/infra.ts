import { LoginID, AuthCredential } from "../auth_credential/data";
import { Password } from "../password/data";
import { ResetToken } from "./data";

export type Infra = {
    passwordResetClient: PasswordResetClient,
}

export interface PasswordResetClient {
    reset(token: ResetToken, loginID: LoginID, password: Password): Promise<ResetResponse>
}

export type ResetResponse =
    Readonly<{ success: false, err: ResetError }> |
    Readonly<{ success: true, authCredential: AuthCredential }>
export function resetFailed(err: ResetError): ResetResponse {
    return { success: false, err }
}
export function resetSuccess(authCredential: AuthCredential): ResetResponse {
    return { success: true, authCredential }
}

export type ResetError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
