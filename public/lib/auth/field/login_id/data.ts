import { LoginIDFieldError } from "../../../field/login_id/data"
import { Valid } from "../../../input/data"

export type LoginIDFieldComponentState =
    Readonly<{ type: "input-login-id", result: Valid<LoginIDFieldError> }>

export const initialLoginIDFieldComponentState: LoginIDFieldComponentState = { type: "input-login-id", result: { valid: true } }
