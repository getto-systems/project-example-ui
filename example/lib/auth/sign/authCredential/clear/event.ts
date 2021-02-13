import { StorageError } from "../../../../common/auth/storage/data";

export type LogoutEvent =
    | Readonly<{ type: "failed-to-logout"; err: StorageError }>
    | Readonly<{ type: "succeed-to-logout" }>
