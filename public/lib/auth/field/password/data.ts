import { PasswordError, PasswordCharacter, PasswordView } from "../../../field/password/data"
import { Valid } from "../../../input/data"

export type PasswordFieldComponentState =
    Readonly<{ type: "input-password", result: Valid<PasswordError>, character: PasswordCharacter, view: PasswordView }>

export const initialPasswordFieldComponentState: PasswordFieldComponentState = {
    type: "input-password",
    result: { valid: true },
    character: { complex: false },
    view: { show: false },
}
