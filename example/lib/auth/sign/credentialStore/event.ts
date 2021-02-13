import { AuthCredential, StorageError } from "../../common/credential/data"
import { RenewError } from "./data"

export type RenewEvent =
    | Readonly<{ type: "try-to-instant-load" }>
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-renew"; authCredential: AuthCredential }>

export type ForceRenewEvent =
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-renew"; authCredential: AuthCredential }>

export type LogoutEvent =
    | Readonly<{ type: "failed-to-logout"; err: StorageError }>
    | Readonly<{ type: "succeed-to-logout" }>
