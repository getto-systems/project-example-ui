import { LoginID } from "../../../common/loginID/data"
import { Password } from "../../../common/password/data"

export type PasswordLoginFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type AuthenticatePasswordError =
    | Readonly<{ type: "validation-error" }>
    | AuthenticatePasswordRemoteError

export type AuthenticatePasswordRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-login" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
