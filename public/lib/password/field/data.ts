import { Password } from "../../password/data"
import { InputValue, Valid, Content } from "../../field/data"

// complex : 2バイト以上の文字を含むか？
export type PasswordCharacter =
    Readonly<{ complex: false }> |
    Readonly<{ complex: true }>
export const simplePassword: PasswordCharacter = { complex: false }
export const complexPassword: PasswordCharacter = { complex: true }

export type PasswordView =
    Readonly<{ show: false }> |
    Readonly<{ show: true, password: InputValue }>
export const hidePassword: PasswordView = { show: false }
export function showPassword(password: InputValue): PasswordView {
    return { show: true, password }
}

export type PasswordFieldError = "empty" | "too-long"

export type PasswordFieldOperation =
    Readonly<{ type: "set-password", password: InputValue }> |
    Readonly<{ type: "show-password" }> |
    Readonly<{ type: "hide-password" }>

export type PasswordFieldEvent = Readonly<{
    type: "succeed-to-update-password",
    result: Valid<PasswordFieldError>,
    content: Content<Password>,
    character: PasswordCharacter,
    view: PasswordView,
}>
