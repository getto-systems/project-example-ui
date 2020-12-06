import { AuthCredential, LastLogin } from "../../common/credential/data"

export type RenewEvent =
    | Readonly<{ type: "try-to-instant-load" }>
    | Readonly<{ type: "unauthorized" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "succeed-to-renew"; authCredential: AuthCredential }>

export type SetContinuousRenewEvent =
    | Readonly<{ type: "unauthorized" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "succeed-to-renew"; authCredential: AuthCredential }>

export type FindEvent =
    | Readonly<{ type: "failed-to-find"; err: StorageError }>
    | Readonly<{ type: "not-found" }>
    | Readonly<{ type: "succeed-to-find"; lastLogin: LastLogin }>

export type StoreEvent =
    | Readonly<{ type: "failed-to-store"; err: StorageError }>
    | Readonly<{ type: "succeed-to-store" }>

export type RemoveEvent =
    | Readonly<{ type: "failed-to-remove"; err: StorageError }>
    | Readonly<{ type: "succeed-to-remove" }>

export type StorageError = Readonly<{ type: "infra-error"; err: string }>

export type RenewError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
