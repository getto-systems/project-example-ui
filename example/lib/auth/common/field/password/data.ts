import { FormInput } from "../../../../sub/getto-form/action/action"
import { FormInputString } from "../../../../sub/getto-form/data"
import { InputValue } from "../data"

export type PasswordInput = FormInput

// complex : 2バイト以上の文字を含むか？
export type PasswordCharacter = Readonly<{ complex: false }> | Readonly<{ complex: true }>

// パスワードを表示するか？
export type PasswordViewState = Readonly<{ show: false }> | Readonly<{ show: true }>

export type PasswordView =
    | Readonly<{ show: false }>
    | Readonly<{ show: true; password: FormInputString }>

// TODO あとで削除
export function showPassword(password: InputValue): PasswordView {
    return { show: true, password: (password as unknown) as FormInputString } as PasswordView
}

export type PasswordFieldError = "empty" | "too-long"
