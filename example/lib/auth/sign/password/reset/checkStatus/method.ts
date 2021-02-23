import { ResetSessionID } from "../kernel/data"
import { CheckSendingStatusEvent } from "./event"

export interface CheckSendingStatusMethodPod {
    (locationInfo: CheckSendingStatusLocationInfo): CheckSendingStatusMethod
}
export interface CheckSendingStatusLocationInfo {
    getPasswordResetSessionID(): ResetSessionID
}
export interface CheckSendingStatusMethod {
    (post: Post<CheckSendingStatusEvent>): void
}

interface Post<T> {
    (state: T): void
}
