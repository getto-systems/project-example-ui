import { StorageError } from "../../../../common/storage/data"
import { AuthCredential } from "../common/data"
import { RequestError } from "./data"

export type RequestEvent = Readonly<{ type: "try-to-instant-load" }> | ForceRequestEvent

export type ForceRequestEvent =
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RequestError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-renew"; authCredential: AuthCredential }>
