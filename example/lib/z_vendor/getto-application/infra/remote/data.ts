export type RemoteCommonError =
    | Readonly<{ type: "unauthorized" }>
    | Readonly<{ type: "invalid-nonce" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | RemoteInfraError

export type RemoteInfraError = Readonly<{ type: "infra-error"; err: string }>
