import { ResetSessionID } from "../kernel/data"
import { CheckPasswordResetSendingStatusEvent } from "./event"

export interface CheckPasswordResetSendingStatusMethodPod {
    (
        locationInfo: CheckPasswordResetSendingStatusLocationInfo,
    ): CheckPasswordResetSendingStatusMethod
}
export interface CheckPasswordResetSendingStatusLocationInfo {
    getPasswordResetSessionID(): ResetSessionID
}
export interface CheckPasswordResetSendingStatusMethod {
    (post: Post<CheckPasswordResetSendingStatusEvent>): void
}

interface Post<T> {
    (state: T): void
}
