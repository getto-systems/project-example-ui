import { LoginID } from "../../../common/fields/login_id/data"

export type RequestResetTokenFields = Readonly<{
    loginID: LoginID
}>

export type RequestResetTokenError =
    | Readonly<{ type: "validation-error" }>
    | RequestResetTokenRemoteError

export type RequestResetTokenRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
