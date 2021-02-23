import { LoginID } from "../../../common/loginID/data"
import { Password } from "../../../common/password/data"

export type ResetFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type ResetError =
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "empty-reset-token" }>
    | ResetRemoteError

export type ResetRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
