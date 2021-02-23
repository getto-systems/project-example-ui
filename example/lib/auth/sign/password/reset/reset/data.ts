import { LoginID } from "../../../common/loginID/data"
import { Password } from "../../../common/password/data"

export type PasswordResetFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type ResetPasswordError =
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "empty-reset-token" }>
    | ResetPasswordRemoteError

export type ResetPasswordRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
