import { StorageError } from "../../../../../z_vendor/getto-application/storage/data"

export type ClearEvent =
    | Readonly<{ type: "failed-to-logout"; err: StorageError }>
    | Readonly<{ type: "succeed-to-logout" }>
