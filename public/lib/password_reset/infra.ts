import { LoginID, AuthCredential } from "../credential/data"
import { Password } from "../password/data"
import { ResetToken } from "./data"

export type Infra = Readonly<{
    timeConfig: TimeConfig,
    passwordResetClient: PasswordResetClient,
}>

export type TimeConfig = Readonly<{
    passwordResetDelayTime: DelayTime,
}>

export type DelayTime = Readonly<{ delay_milli_second: number }>

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
