export type Password = Readonly<{ password: Readonly<string> }>

export type PasswordBoard =
    Readonly<{ character: PasswordCharacter, view: PasswordView, err: Array<PasswordValidationError> }>

// complex : 2バイト以上の文字を含むか？
export type PasswordCharacter =
    Readonly<{ complex: false }> |
    Readonly<{ complex: true }>
export const simplePassword: PasswordCharacter = { complex: false }
export const complexPassword: PasswordCharacter = { complex: true }

export type PasswordView =
    Readonly<{ show: false }> |
    Readonly<{ show: true, password: Password }>
export const hidePassword: PasswordView = { show: false }
export function showPassword(password: Password): PasswordView {
    return { show: true, password }
}

export type PasswordValidationError = "empty" | "too-long";

export type ValidPassword =
    Readonly<{ valid: false }> |
    Readonly<{ valid: true, content: Password }>
