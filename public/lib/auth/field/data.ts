export type InputValue = string & { InputValue: never }
export function markInputValue(value: string): InputValue {
    return value as InputValue
}

export type Content<T> =
    | Readonly<{ Content: never; valid: true; content: T }>
    | Readonly<{ Content: never; valid: false }>
export function validContent<T>(content: T): Content<T> {
    return { valid: true, content } as Content<T>
}
export function invalidContent<T>(): Content<T> {
    return { valid: false } as Content<T>
}

export type Valid<T> =
    | Readonly<{ Valid: never; valid: true }>
    | Readonly<{ Valid: never; valid: false; err: T[] }>
export function noError<T>(): Valid<T> {
    return { valid: true } as Valid<T>
}
export function hasError<T>(err: T[]): Valid<T> {
    if (err.length === 0) {
        return noError()
    }
    return { valid: false, err } as Valid<T>
}

interface Builder<T> {
    (): T
}
