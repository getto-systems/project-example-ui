import { SubmitEvent } from "./event"

import { FormConvertResult } from "../../../../../common/getto-form/form/data"
import { ResetToken, ResetFields } from "./data"

export type RegisterAction = Readonly<{
    submit: SubmitMethod
}>
export type RegisterActionPod = Readonly<{
    initSubmit: SubmitPod
}>
export type RegisterActionLocationInfo = SubmitLocationInfo

export interface SubmitPod {
    (locationInfo: SubmitLocationInfo): SubmitMethod
}
export interface SubmitLocationInfo {
    getResetToken(): ResetToken
}
export interface SubmitMethod {
    (fields: FormConvertResult<ResetFields>, post: Post<SubmitEvent>): void
}

interface Post<T> {
    (state: T): void
}
