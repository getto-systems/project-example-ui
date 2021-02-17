import { StorageError } from "../../../../../common/storage/data"

export type StartContinuousRenewAuthnInfoEvent =
    | ForceStartContinuousRenewAuthnInfoEvent
    | Readonly<{ type: "storage-error"; err: StorageError }>

export type ForceStartContinuousRenewAuthnInfoEvent = Readonly<{
    type: "succeed-to-start-continuous-renew"
}>
