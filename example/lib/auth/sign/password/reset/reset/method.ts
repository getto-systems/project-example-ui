import { ResetPasswordEvent } from "./event"

import { ConvertBoardResult } from "../../../../../z_vendor/getto-application/board/kernel/data"
import { ResetToken } from "../kernel/data"
import { ResetPasswordFields } from "./data"
import { LocationTypes } from "../../../../../z_vendor/getto-application/location/detecter"

export interface ResetPasswordPod {
    (detecter: ResetPasswordLocationDetecter): ResetPasswordMethod
}

type ResetLocationTypes = LocationTypes<Readonly<{ token: string }>, ResetToken>
export type ResetPasswordLocationDetecter = ResetLocationTypes["detecter"]
export type ResetPasswordLocationDetectMethod = ResetLocationTypes["method"]
export type ResetPasswordLocationInfo = ResetLocationTypes["info"]
export type ResetPasswordLocationKeys = ResetLocationTypes["keys"]

export interface ResetPasswordMethod {
    (fields: ConvertBoardResult<ResetPasswordFields>, post: Post<ResetPasswordEvent>): void
}

interface Post<T> {
    (state: T): void
}
