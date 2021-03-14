import { ResetPasswordEvent } from "./event"

import { ConvertBoardResult } from "../../../../../z_vendor/getto-application/board/kernel/data"
import { ResetToken } from "../data"
import { ResetPasswordFields } from "./data"
import { LocationTypes } from "../../../../../z_vendor/getto-application/location/infra"

export interface ResetPasswordPod {
    (detecter: ResetPasswordLocationDetecter): ResetPasswordMethod
}

type ResetLocationTypes = LocationTypes<ResetToken>
export type ResetPasswordLocationDetecter = ResetLocationTypes["detecter"]
export type ResetPasswordLocationDetectMethod = ResetLocationTypes["method"]
export type ResetPasswordLocationInfo = ResetLocationTypes["info"]

export interface ResetPasswordMethod {
    (fields: ConvertBoardResult<ResetPasswordFields>, post: Post<ResetPasswordEvent>): void
}

interface Post<T> {
    (state: T): void
}
