import { StorageError } from "../../../../../common/storage/data"
import { AuthnInfo } from "../kernel/data"
import { RenewAuthnInfoError } from "./data"

export type RenewAuthnInfoEvent =
    | Readonly<{ type: "try-to-instant-load" }>
    | ForceRenewAuthnInfoEvent

export type ForceRenewAuthnInfoEvent =
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewAuthnInfoError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-renew"; authnInfo: AuthnInfo }>
