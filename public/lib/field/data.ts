export type InputValue = Readonly<_InputValue>

export function initInputValue(inputValue: string): InputValue {
    return inputValue as _InputValue
}

export function inputValueToString(inputValue: InputValue): Readonly<string> {
    return inputValue as unknown as string
}

type _InputValue = string & { InputValue: never }

export type Content<T> =
    Readonly<{ valid: true, content: T }> |
    Readonly<{ valid: false }>
export function validContent<T>(content: T): Content<T> {
    return { valid: true, content }
}
export function invalidContent<T>(): Content<T> {
    return { valid: false }
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
