import { StorageError } from "../../../../common/storage/data"
import { AuthnInfo } from "../common/data"
import { RequestRenewAuthnInfoError } from "./data"

export type RequestRenewAuthnInfoEvent =
    | Readonly<{ type: "try-to-instant-load" }>
    | ForceRequestRenewAuthnInfoEvent

export type ForceRequestRenewAuthnInfoEvent =
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RequestRenewAuthnInfoError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-renew"; authnInfo: AuthnInfo }>
