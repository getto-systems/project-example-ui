import { LoginID } from "../../../common/fields/loginID/data"

export type RequestTokenFields = Readonly<{
    loginID: LoginID
}>

export type RequestTokenError =
    | Readonly<{ type: "validation-error" }>
    | RequestTokenRemoteError

export type RequestTokenRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
