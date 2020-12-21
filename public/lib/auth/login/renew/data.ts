import { AuthCredential, StorageError } from "../../common/credential/data"

export type StoreAuthCredential =
    | Readonly<{ store: false }>
    | Readonly<{ store: true; authCredential: AuthCredential }>
export const emptyAuthCredential: StoreAuthCredential = { store: false }
export function storeAuthCredential(authCredential: AuthCredential): StoreAuthCredential {
    return { store: true, authCredential }
}

export type RenewEvent =
    | Readonly<{ type: "try-to-instant-load" }>
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-renew"; authCredential: AuthCredential }>

export type ForceRenewEvent =
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-renew"; authCredential: AuthCredential }>

export type SetContinuousRenewEvent =
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-set-continuous-renew" }>

export type RenewError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
