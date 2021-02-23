import { LoginID } from "../../common/loginID/data"
import { Password } from "../../common/password/data"

export type AuthenticateFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type AuthenticateError =
    | Readonly<{ type: "validation-error" }>
    | AuthenticateRemoteError

export type AuthenticateRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-login" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
