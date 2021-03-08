import { LocationTypes } from "../../../../../z_vendor/getto-application/location/detecter"

import { CheckResetTokenSendingStatusEvent } from "./event"

import { ResetSessionID } from "../kernel/data"

export interface CheckResetTokenSendingStatusPod {
    (detecter: CheckResetTokenSendingStatusLocationDetecter): CheckSendingStatusMethod
}

type CheckStatusLocationTypes = LocationTypes<Readonly<{ sessionID: string }>, ResetSessionID>
export type CheckResetTokenSendingStatusLocationDetecter = CheckStatusLocationTypes["detecter"]
export type CheckResetTokenSendingStatusLocationDetectMethod = CheckStatusLocationTypes["method"]
export type CheckResetTokenSendingStatusLocationInfo = CheckStatusLocationTypes["info"]
export type CheckResetTokenSendingStatusLocationKeys = CheckStatusLocationTypes["keys"]

export interface CheckSendingStatusMethod {
    (post: Post<CheckResetTokenSendingStatusEvent>): void
}

interface Post<T> {
    (state: T): void
}
