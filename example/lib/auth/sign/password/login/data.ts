import { LoginID } from "../../../common/loginID/data"
import { Password } from "../../../common/password/data"

export type PasswordLoginFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type SubmitPasswordLoginError =
    | Readonly<{ type: "validation-error" }>
    | SubmitPasswordLoginRemoteError

export type SubmitPasswordLoginRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-login" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
