import { LocationTypes } from "../../../../../z_vendor/getto-application/location/infra"

import { CheckResetTokenSendingStatusEvent } from "./event"

import { ResetSessionID } from "../kernel/data"

export interface CheckResetTokenSendingStatusPod {
    (detecter: CheckResetTokenSendingStatusLocationDetecter): CheckSendingStatusMethod
}

type CheckStatusLocationTypes = LocationTypes<ResetSessionID>
export type CheckResetTokenSendingStatusLocationDetecter = CheckStatusLocationTypes["detecter"]
export type CheckResetTokenSendingStatusLocationDetectMethod = CheckStatusLocationTypes["method"]
export type CheckResetTokenSendingStatusLocationInfo = CheckStatusLocationTypes["info"]

export interface CheckSendingStatusMethod {
    (post: Post<CheckResetTokenSendingStatusEvent>): void
}

interface Post<T> {
    (state: T): void
}
