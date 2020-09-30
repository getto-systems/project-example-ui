import {
    PasswordFieldError,
    PasswordCharacter, simplePassword,
    PasswordView, hidePassword,
} from "../../../../password/field/data"
import { Valid, noError } from "../../../../field/data"

export type PasswordFieldState = Readonly<{
    type: "succeed-to-update-password",
    result: Valid<PasswordFieldError>,
    character: PasswordCharacter,
    view: PasswordView,
}>

export const initialPasswordFieldState: PasswordFieldState = {
    type: "succeed-to-update-password",
    result: noError(),
    character: simplePassword,
    view: hidePassword,
}
