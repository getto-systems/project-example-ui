import { AuthCredential, RenewError } from "../../credential/data"

export type RenewCredentialComponentState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "unauthorized" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "succeed-to-renew", authCredential: AuthCredential }>

export const initialRenewCredentialComponentState: RenewCredentialComponentState = { type: "initial-renew" }
