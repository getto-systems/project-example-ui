export type FormInputString = string & { InputString: never }
export function markInputString(value: string): FormInputString {
    return value as FormInputString
}

export type FormConvertResult<T> = Readonly<{ success: true; value: T }> | Readonly<{ success: false }>
export type FormValidationResult<E> = Readonly<{ valid: true }> | Readonly<{ valid: false; err: E[] }>

export function toValidationError<E>(err: E[]): FormValidationResult<E> {
    if (err.length === 0) {
        return { valid: true }
    }
    return { valid: false, err }
}
