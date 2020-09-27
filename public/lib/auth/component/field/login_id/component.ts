import { packInputValue } from "../../../../field/adapter"

import { LoginIDFieldError } from "../../../../field/login_id/data"
import { InputValue, Valid } from "../../../../field/data"

export type LoginIDFieldState =
    Readonly<{ type: "succeed-to-update-login_id", inputValue: InputValue, result: Valid<LoginIDFieldError> }>

export const initialLoginIDFieldState: LoginIDFieldState = {
    type: "succeed-to-update-login_id",
    inputValue: packInputValue(""),
    result: { valid: true },
}
