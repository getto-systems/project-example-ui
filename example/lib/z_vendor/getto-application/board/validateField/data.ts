export type BoardFieldConvertResult<T, E> =
    | Readonly<{ valid: true; value: T }>
    | Readonly<{ valid: false; err: E[] }>
