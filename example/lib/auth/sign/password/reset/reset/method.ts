import { ResetEvent } from "./event"

import { BoardConvertResult } from "../../../../../z_vendor/getto-application/board/kernel/data"
import { ResetToken } from "../kernel/data"
import { ResetFields } from "./data"

export interface ResetPod {
    (locationInfo: ResetLocationInfo): ResetMethod
}
export interface ResetLocationInfo {
    getResetToken(): ResetToken
}
export interface ResetMethod {
    (fields: BoardConvertResult<ResetFields>, post: Post<ResetEvent>): void
}

interface Post<T> {
    (state: T): void
}
