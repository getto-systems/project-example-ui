export type ApiResult<V, E> =
    | Readonly<{ success: true; value: V }>
    | Readonly<{ success: false; err: E }>

export type ApiError =
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "infra-error"; err: string }>
