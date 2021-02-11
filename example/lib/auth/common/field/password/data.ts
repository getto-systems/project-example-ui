import { FormInput } from "../../../../sub/getto-form/form/action"
import { FormInputString } from "../../../../sub/getto-form/form/data"

export type PasswordInput = FormInput

// complex : 2バイト以上の文字を含むか？
export type PasswordCharacter = Readonly<{ complex: false }> | Readonly<{ complex: true }>

// パスワードを表示するか？
export type PasswordViewState = Readonly<{ show: false }> | Readonly<{ show: true }>

export type PasswordView =
    | Readonly<{ show: false }>
    | Readonly<{ show: true; password: FormInputString }>

export type PasswordValidationError = "empty" | "too-long"
