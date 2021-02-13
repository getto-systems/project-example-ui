import { AuthCredential, StorageError } from "../../common/credential/data"

export type StoreAuthCredential =
    | Readonly<{ store: false }>
    | Readonly<{ store: true; authCredential: AuthCredential }>
export const emptyAuthCredential: StoreAuthCredential = { store: false }
export function storeAuthCredential(authCredential: AuthCredential): StoreAuthCredential {
    return { store: true, authCredential }
}

export type SetContinuousRenewEvent =
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-set-continuous-renew" }>

export type RenewError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type RenewRemoteError = RenewError | Readonly<{ type: "invalid-ticket" }>
