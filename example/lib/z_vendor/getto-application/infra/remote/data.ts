export type RemoteCommonError =
    | Readonly<{ type: "unauthorized" }>
    | Readonly<{ type: "invalid-nonce" }>
    | Readonly<{ type: "server-error" }>
    | RemoteInfraError

export type RemoteInfraError = Readonly<{ type: "infra-error"; err: string }>
