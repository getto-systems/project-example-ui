import { StorageError } from "../../../../../../z_vendor/getto-application/storage/data"

export type StartContinuousRenewEvent =
    | ForceStartContinuousRenewEvent
    | Readonly<{ type: "storage-error"; err: StorageError }>

export type ForceStartContinuousRenewEvent = Readonly<{
    type: "succeed-to-start-continuous-renew"
}>
