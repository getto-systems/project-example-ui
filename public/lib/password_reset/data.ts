import { AuthCredential } from "../credential/data"
import { InputValue } from "../field/data"

export type InputContent = Readonly<{
    loginID: InputValue,
    password: InputValue,
}>

export type ResetToken = Readonly<{ resetToken: Readonly<string> }>

export type ResetEvent =
    Readonly<{ type: "try-to-reset" }> |
    Readonly<{ type: "delayed-to-reset" }> |
    Readonly<{ type: "failed-to-reset", content: InputContent, err: ResetError }> |
    Readonly<{ type: "succeed-to-reset", authCredential: AuthCredential }>

export type ResetError =
    Readonly<{ type: "validation-error" }> |
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
