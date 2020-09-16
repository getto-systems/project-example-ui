import { InputValue } from "../field/data"

export type InputContent = Readonly<{
    loginID: InputValue,
    password: InputValue,
}>

export type ResetToken = Readonly<{ resetToken: Readonly<string> }>

export type ResetError =
    Readonly<{ type: "validation-error" }> |
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
