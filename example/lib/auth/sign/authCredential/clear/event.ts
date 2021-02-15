import { StorageError } from "../../../../common/storage/data";

export type SubmitClearAuthCredentialEvent =
    | Readonly<{ type: "failed-to-logout"; err: StorageError }>
    | Readonly<{ type: "succeed-to-logout" }>
