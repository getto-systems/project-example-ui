export type BoardFieldValidateResult<E> =
    | BoardFieldValidateResult_ok
    | Readonly<{ valid: false; err: E[] }>

export const boardFieldValidateResult_ok = { valid: true } as const
export type BoardFieldValidateResult_ok = typeof boardFieldValidateResult_ok

export function boardFieldValidateResult<E>(err: E[]): BoardFieldValidateResult<E> {
    if (err.length === 0) {
        return { valid: true }
    }
    return { valid: false, err }
}
