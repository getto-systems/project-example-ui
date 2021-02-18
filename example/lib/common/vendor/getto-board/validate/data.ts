export type BoardValidateResult<E> =
    | Readonly<{ success: true }>
    | Readonly<{ success: false; err: E[] }>

export function boardValidateResult<E>(err: E[]): BoardValidateResult<E> {
    if (err.length === 0) {
        return { success: true }
    }
    return { success: false, err }
}
