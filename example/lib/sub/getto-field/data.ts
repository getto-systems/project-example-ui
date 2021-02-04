export type FieldInputString = string & { InputString: never }
export function markInputString(value: string): FieldInputString {
    return value as FieldInputString
}

export type FieldConvertResult<T> = Readonly<{ success: true; value: T }> | Readonly<{ success: false }>
export type FieldValidationError<E> = Readonly<{ valid: true }> | Readonly<{ valid: false; err: E }>

export function toValidationErrors<T, E extends Array<T>>(err: E): FieldValidationError<E> {
    if (err.length === 0) {
        return { valid: true }
    }
    return { valid: false, err }
}
