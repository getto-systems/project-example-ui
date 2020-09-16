import { AuthCredential } from "../credential/data"
import { InputValue } from "../field/data"

export type InputContent = Readonly<{
    loginID: InputValue,
    password: InputValue,
}>

export type LoginEvent =
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", content: InputContent, err: LoginError }> |
    Readonly<{ type: "succeed-to-login", authCredential: AuthCredential }>

export type LoginError =
    Readonly<{ type: "validation-error" }> |
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-login" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
