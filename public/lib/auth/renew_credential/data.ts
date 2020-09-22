import { AuthCredential, RenewError } from "../../credential/data"

export type RenewCredentialState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "unauthorized" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "succeed-to-renew", authCredential: AuthCredential }>

export const initialRenewCredentialState: RenewCredentialState = { type: "initial-renew" }
