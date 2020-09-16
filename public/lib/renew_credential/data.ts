import { AuthCredential } from "../credential/data"

export type RenewCredentialEvent =
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-renew", err: RenewCredentialError }> |
    Readonly<{ type: "unauthorized" }> |
    Readonly<{ type: "succeed-to-renew", authCredential: AuthCredential }>

export type RenewCredentialError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
