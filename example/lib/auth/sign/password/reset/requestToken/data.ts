import { LoginID } from "../../../../common/loginID/data"

export type PasswordResetRequestFields = Readonly<{
    loginID: LoginID
}>

export type RequestPasswordResetTokenError =
    | Readonly<{ type: "validation-error" }>
    | RequestPasswordResetTokenRemoteError

export type RequestPasswordResetTokenRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
