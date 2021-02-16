export type RequestRenewAuthnInfoError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type RequestRenewAuthnInfoRemoteError =
    | RequestRenewAuthnInfoError
    | Readonly<{ type: "invalid-ticket" }>
