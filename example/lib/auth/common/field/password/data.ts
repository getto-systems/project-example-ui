import { Password } from "../../password/data"
import { InputValue, Content, Valid } from "../data"

// complex : 2バイト以上の文字を含むか？
export type PasswordCharacter =
    | Readonly<{ PasswordCharacter: never; complex: false }>
    | Readonly<{ PasswordCharacter: never; complex: true }>
export const simplePassword: PasswordCharacter = { complex: false } as PasswordCharacter
export const complexPassword: PasswordCharacter = { complex: true } as PasswordCharacter

export type PasswordView =
    | Readonly<{ PasswordView: never; show: false }>
    | Readonly<{ PasswordView: never; show: true; password: InputValue }>
export const hidePassword: PasswordView = { show: false } as PasswordView
export function showPassword(password: InputValue): PasswordView {
    return { show: true, password } as PasswordView
}

export type PasswordFieldError = "empty" | "too-long"

export type PasswordFieldEvent = Readonly<{
    type: "succeed-to-update"
    result: Valid<PasswordFieldError>
    content: Content<Password>
    character: PasswordCharacter
    view: PasswordView
}>
