import { LoginIDFieldError } from "../../../field/login_id/data"
import { Valid } from "../../../field/data"

export type LoginIDFieldComponentState =
    Readonly<{ type: "succeed-to-update-login_id", result: Valid<LoginIDFieldError> }>

export const initialLoginIDFieldComponentState: LoginIDFieldComponentState = {
    type: "succeed-to-update-login_id",
    result: { valid: true },
}
