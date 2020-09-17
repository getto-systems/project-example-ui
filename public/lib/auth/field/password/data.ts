import { PasswordFieldError, PasswordCharacter, PasswordView } from "../../../field/password/data"
import { Valid } from "../../../field/data"

export type PasswordFieldComponentState = Readonly<{
    type: "succeed-to-update-password",
    result: Valid<PasswordFieldError>,
    character: PasswordCharacter,
    view: PasswordView,
}>

export const initialPasswordFieldComponentState: PasswordFieldComponentState = {
    type: "succeed-to-update-password",
    result: { valid: true },
    character: { complex: false },
    view: { show: false },
}
