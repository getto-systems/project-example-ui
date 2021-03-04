import { LocationDetecter } from "../../../../../z_vendor/getto-application/location/detecter"

import { CheckSendingStatusEvent } from "./event"

import { ResetSessionID } from "../kernel/data"

export interface CheckSendingStatusMethodPod {
    (detecter: CheckSendingStatusLocationDetecter): CheckSendingStatusMethod
}
export type CheckSendingStatusLocationDetecter = LocationDetecter<CheckSendingStatusLocationInfo>
export type CheckSendingStatusLocationInfo = ResetSessionID
export type CheckSendingStatusLocationKeys = Readonly<{
    sessionID: string
}>

export interface CheckSendingStatusMethod {
    (post: Post<CheckSendingStatusEvent>): void
}

interface Post<T> {
    (state: T): void
}
