export type RenewAuthnInfoError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type RenewAuthnInfoRemoteError =
    | RenewAuthnInfoError
    | Readonly<{ type: "invalid-ticket" }>
