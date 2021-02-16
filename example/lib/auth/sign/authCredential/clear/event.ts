import { StorageError } from "../../../../common/storage/data";

export type ClearAuthCredentialEvent =
    | Readonly<{ type: "failed-to-logout"; err: StorageError }>
    | Readonly<{ type: "succeed-to-logout" }>
