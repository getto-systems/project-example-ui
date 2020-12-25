import { AuthCredential } from "../../common/credential/data"
import { LoginID } from "../../common/loginID/data"
import { Password } from "../../common/password/data"

export type LoginFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type LoginEvent =
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "failed-to-login"; err: LoginError }>
    | Readonly<{ type: "succeed-to-login"; authCredential: AuthCredential }>

export type LoginError =
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-login" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
