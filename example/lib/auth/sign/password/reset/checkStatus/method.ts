import { LocationTypes } from "../../../../../z_vendor/getto-application/location/detecter"

import { CheckSendingStatusEvent } from "./event"

import { ResetSessionID } from "../kernel/data"

export interface CheckSendingStatusMethodPod {
    (detecter: CheckSendingStatusLocationDetecter): CheckSendingStatusMethod
}

type CheckSendingStatusLocationTypes = LocationTypes<
    Readonly<{ sessionID: string }>,
    ResetSessionID
>
export type CheckSendingStatusLocationDetecter = CheckSendingStatusLocationTypes["detecter"]
export type CheckSendingStatusLocationDetectMethod = CheckSendingStatusLocationTypes["method"]
export type CheckSendingStatusLocationInfo = CheckSendingStatusLocationTypes["info"]
export type CheckSendingStatusLocationKeys = CheckSendingStatusLocationTypes["keys"]

export interface CheckSendingStatusMethod {
    (post: Post<CheckSendingStatusEvent>): void
}

interface Post<T> {
    (state: T): void
}
