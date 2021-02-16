import { StorageError } from "../../../../common/storage/data"

export type StartContinuousRenewAuthCredentialEvent =
    | ForceStartContinuousRenewAuthCredentialEvent
    | Readonly<{ type: "storage-error"; err: StorageError }>

export type ForceStartContinuousRenewAuthCredentialEvent = Readonly<{
    type: "succeed-to-start-continuous-renew"
}>
