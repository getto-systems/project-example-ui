import { AuthCredential } from "../credential/data"
import { LoginID } from "../login_id/data"
import { Password } from "../password/data"
import { Content } from "../field/data"

export type LoginContent = Readonly<{
    loginID: Content<LoginID>
    password: Content<Password>
}>

export type LoginFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type PasswordLoginRequest =
    Readonly<{ type: "login", content: LoginContent }>

export type PasswordLoginEvent =
    Readonly<{ type: "login", event: LoginEvent }>

export type LoginEvent =
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", err: LoginError }> |
    Readonly<{ type: "succeed-to-login", authCredential: AuthCredential }>

export type LoginError =
    Readonly<{ type: "validation-error" }> |
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-login" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
