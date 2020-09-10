import { InputValue } from "../input/data"

export type Password = Readonly<{ password: Readonly<string> }>

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

export type PasswordError = "empty" | "too-long"
