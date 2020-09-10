import { InputValue } from "../input/data"

export type InputContent = Readonly<{
    loginID: InputValue,
    password: InputValue,
}>

export type LoginError =
    Readonly<{ type: "validation-error" }> |
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-login" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
