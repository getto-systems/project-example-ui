export type InputValue = { inputValue: string }

export type InitialValue =
    Readonly<{ hasValue: false }> |
    Readonly<{ hasValue: true, value: InputValue }>
export const noValue: InitialValue = { hasValue: false }
export function hasValue(value: InputValue): InitialValue {
    return { hasValue: true, value }
}

export type Content<T> =
    Readonly<{ input: InputValue, valid: true, content: T }> |
    Readonly<{ input: InputValue, valid: false }>
export function validContent<T>(input: InputValue, content: T): Content<T> {
    return { input, valid: true, content }
}
export function invalidContent<T>(input: InputValue): Content<T> {
    return { input, valid: false }
}

export type Valid<T> =
    Readonly<{ valid: true }> |
    Readonly<{ valid: false, err: Array<T> }>
export function noError<T>(): Valid<T> {
    return { valid: true }
}
export function hasError<T>(err: Array<T>): Valid<T> {
    if (err.length === 0) {
        return { valid: true }
    }
    return { valid: false, err }
}

// complex : 2バイト以上の文字を含むか？
export type PasswordCharacter =
    Readonly<{ complex: false }> |
    Readonly<{ complex: true }>

export type PasswordView =
    Readonly<{ show: false }> |
    Readonly<{ show: true, inputValue: InputValue }>
