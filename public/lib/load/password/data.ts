export type Password = Readonly<{ password: Readonly<string> }>

export type PasswordValidationError = "empty" | "too-long";

// complex : 2バイト以上の文字を含むか？
export type PasswordCharacter =
    Readonly<{ complex: false }> |
    Readonly<{ complex: true }>
export const simplePassword: PasswordCharacter = { complex: false }
export const complexPassword: PasswordCharacter = { complex: true }
