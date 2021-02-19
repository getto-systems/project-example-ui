export type BoardConvertResult<T> =
    | Readonly<{ success: true; value: T }>
    | Readonly<{ success: false }>

export type BoardValidateResult<E> = BoardValidateResult_ok | Readonly<{ valid: false; err: E[] }>
export type BoardValidateResult_ok = Readonly<{ valid: true }>
export const boardValidateResult_ok: BoardValidateResult_ok = { valid: true }

export function boardValidateResult<E>(err: E[]): BoardValidateResult<E> {
    if (err.length === 0) {
        return { valid: true }
    }
    return { valid: false, err }
}
