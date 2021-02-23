import { StorageError } from "../../../../../../z_getto/storage/data"

export type StartContinuousRenewEvent =
    | ForceStartContinuousRenewEvent
    | Readonly<{ type: "storage-error"; err: StorageError }>

export type ForceStartContinuousRenewEvent = Readonly<{
    type: "succeed-to-start-continuous-renew"
}>
