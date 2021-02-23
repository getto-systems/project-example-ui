import { StorageError } from "../../../../../z_getto/storage/data"

export type ClearEvent =
    | Readonly<{ type: "failed-to-logout"; err: StorageError }>
    | Readonly<{ type: "succeed-to-logout" }>
