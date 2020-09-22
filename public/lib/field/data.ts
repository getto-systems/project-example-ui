export type InputValue = { InputValue: never }

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
    Readonly<{ valid: false, err: T[] }>
export function noError<T>(): Valid<T> {
    return { valid: true }
}
export function hasError<T>(err: T[]): Valid<T> {
    if (err.length === 0) {
        return { valid: true }
    }
    return { valid: false, err }
}
