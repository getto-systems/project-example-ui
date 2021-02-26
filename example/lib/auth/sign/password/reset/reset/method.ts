import { ResetEvent } from "./event"

import { ConvertBoardResult } from "../../../../../z_vendor/getto-application/board/kernel/data"
import { ResetToken } from "../kernel/data"
import { ResetFields } from "./data"

export interface ResetPod {
    (locationInfo: ResetLocationInfo): ResetMethod
}
export interface ResetLocationInfo {
    getResetToken(): ResetToken
}
export interface ResetMethod {
    (fields: ConvertBoardResult<ResetFields>, post: Post<ResetEvent>): void
}

interface Post<T> {
    (state: T): void
}
