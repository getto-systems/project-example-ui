import { LoginID } from "../../common/loginID/data"
import { Password } from "../../common/password/data"

export type LoginFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type LoginError =
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-login" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
