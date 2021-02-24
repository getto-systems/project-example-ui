import { StorageError } from "../../../../../z_getto/storage/data"
import { AuthnInfo, RenewError } from "../kernel/data"

export type RenewEvent = Readonly<{ type: "try-to-instant-load" }> | ForceRenewEvent

export type ForceRenewEvent =
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-renew"; authnInfo: AuthnInfo }>
