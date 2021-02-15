export type RequestRenewAuthCredentialError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type RequestRenewAuthCredentialRemoteError =
    | RequestRenewAuthCredentialError
    | Readonly<{ type: "invalid-ticket" }>
