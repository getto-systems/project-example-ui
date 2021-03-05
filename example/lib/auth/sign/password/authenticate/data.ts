import { LoginID } from "../../common/fields/loginID/data"
import { Password } from "../../common/fields/password/data"

export type AuthenticatePasswordFields = Readonly<{
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
