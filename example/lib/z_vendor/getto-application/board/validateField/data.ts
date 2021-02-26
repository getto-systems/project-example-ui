export type ConvertBoardFieldResult<T, E> =
    | Readonly<{ valid: true; value: T }>
    | Readonly<{ valid: false; err: E[] }>
