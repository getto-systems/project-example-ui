import { StorageError } from "../../../../common/storage/data"
import { AuthCredential } from "../common/data"
import { RequestRenewAuthCredentialError } from "./data"

export type RequestRenewAuthCredentialEvent =
    | Readonly<{ type: "try-to-instant-load" }>
    | ForceRequestRenewAuthCredentialEvent

export type ForceRequestRenewAuthCredentialEvent =
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RequestRenewAuthCredentialError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-renew"; authCredential: AuthCredential }>
