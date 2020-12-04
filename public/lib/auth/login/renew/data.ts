import { LastLogin } from "../../common/credential/data"

export type RenewEvent =
    | Readonly<{ type: "try-to-instant-load" }>
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-renew" }>

export type SetContinuousRenewEvent =
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "storage-error"; err: StorageError }>

export type StoreEvent = Readonly<{ type: "storage-error"; err: StorageError }>

export type LastLoginResponse =
    | Readonly<{ success: false; err: StorageError }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: true; found: true; content: LastLogin }>

export type StorageError = Readonly<{ type: "infra-error"; err: string }>

export type RenewError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
