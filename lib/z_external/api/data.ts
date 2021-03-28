export type ApiResult<V, E> =
    | Readonly<{ success: true; value: V }>
    | Readonly<{ success: false; err: E }>

export type ApiCommonError =
    | Readonly<{ type: "unauthorized" }>
    | Readonly<{ type: "invalid-nonce" }>
    | Readonly<{ type: "server-error" }>

export type ApiAuthenticateResponse = Readonly<{
    roles: string[]
}>
