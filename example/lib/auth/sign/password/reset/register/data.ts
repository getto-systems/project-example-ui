import { LoginID } from "../../../../common/loginID/data"
import { Password } from "../../../../common/password/data"

export type PasswordResetToken = string & { PasswordResetToken: never }
export function markPasswordResetToken(resetToken: string): PasswordResetToken {
    return resetToken as PasswordResetToken
}

export type PasswordResetFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type SubmitPasswordResetRegisterError =
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "empty-reset-token" }>
    | SubmitPasswordResetRegisterRemoteError

export type SubmitPasswordResetRegisterRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
