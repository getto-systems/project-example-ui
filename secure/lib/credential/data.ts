export type ApiCredential = Readonly<{
    // TODO api nonce を追加する
    //apiNonce: ApiNonce,
    apiRoles: ApiRoles,
}>

//export type ApiNonce = { ApiNonce: never }

export type ApiRoles = ApiRole[]
export type ApiRole = { ApiRole: never }

export type FetchResponse =
    Readonly<{ success: false, err: FetchError }> |
    Readonly<{ success: true, found: false }> |
    Readonly<{ success: true, found: true, content: ApiCredential }>

export type FetchError =
    Readonly<{ type: "infra-error", err: string }>
