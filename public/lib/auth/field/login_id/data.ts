import { LoginIDFieldError } from "../../../field/login_id/data"
import { Valid } from "../../../field/data"

export type LoginIDFieldState =
    Readonly<{ type: "succeed-to-update-login_id", result: Valid<LoginIDFieldError> }>

export const initialLoginIDFieldState: LoginIDFieldState = {
    type: "succeed-to-update-login_id",
    result: { valid: true },
}
