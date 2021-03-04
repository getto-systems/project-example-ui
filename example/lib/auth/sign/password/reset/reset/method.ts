import { ResetEvent } from "./event"

import { ConvertBoardResult } from "../../../../../z_vendor/getto-application/board/kernel/data"
import { ResetToken } from "../kernel/data"
import { ResetFields } from "./data"
import { LocationTypes } from "../../../../../z_vendor/getto-application/location/detecter"

export interface ResetPod {
    (detecter: ResetLocationDetecter): ResetMethod
}

type ResetLocationTypes = LocationTypes<Readonly<{ token: string }>, ResetToken>
export type ResetLocationDetecter = ResetLocationTypes["detecter"]
export type ResetLocationDetectMethod = ResetLocationTypes["method"]
export type ResetLocationInfo = ResetLocationTypes["info"]
export type ResetLocationKeys = ResetLocationTypes["keys"]

export interface ResetMethod {
    (fields: ConvertBoardResult<ResetFields>, post: Post<ResetEvent>): void
}

interface Post<T> {
    (state: T): void
}
