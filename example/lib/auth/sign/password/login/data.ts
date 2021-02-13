import { LoginID } from "../../../../common/auth/loginID/data"
import { Password } from "../../../../common/auth/password/data"

export type LoginFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type SubmitError = Readonly<{ type: "validation-error" }> | SubmitRemoteError
export type SubmitRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-login" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
