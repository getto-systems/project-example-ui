export type ApiResult<V> =
    | Readonly<{ success: true; value: V }>
    | Readonly<{ success: false; err: ApiError }>

export type ApiError = Readonly<{ type: string; err: string }>
