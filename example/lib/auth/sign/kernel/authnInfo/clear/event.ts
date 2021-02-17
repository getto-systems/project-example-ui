import { StorageError } from "../../../../../common/storage/data"

export type ClearAuthnInfoEvent =
    | Readonly<{ type: "failed-to-logout"; err: StorageError }>
    | Readonly<{ type: "succeed-to-logout" }>
