import { packInputValue } from "../../../../field/adapter"

import { PasswordFieldError, PasswordCharacter, PasswordView } from "../../../../field/password/data"
import { InputValue, Valid } from "../../../../field/data"

export type PasswordFieldState =
    Readonly<{
        type: "succeed-to-update-password",
        inputValue: InputValue,
        result: Valid<PasswordFieldError>,
        character: PasswordCharacter,
        view: PasswordView,
    }>

export const initialPasswordFieldState: PasswordFieldState = {
    type: "succeed-to-update-password",
    inputValue: packInputValue(""),
    result: { valid: true },
    character: { complex: false },
    view: { show: false },
}
