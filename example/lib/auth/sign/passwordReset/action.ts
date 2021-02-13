import { CheckStatusEvent, ResetEvent, StartSessionEvent } from "./event"

import { SessionID, ResetToken, StartSessionFields, ResetFields } from "./data"
import { FormConvertResult } from "../../../common/getto-form/form/data"

export type ResetSessionAction = Readonly<{
    startSession: StartSessionPod
    checkStatus: CheckStatusPod
}>

export interface StartSessionPod {
    (): StartSession
}
export interface StartSession {
    (fields: FormConvertResult<StartSessionFields>, post: Post<StartSessionEvent>): void
}

export interface CheckStatusPod {
    (): CheckStatus
}
export interface CheckStatus {
    (sessionID: SessionID, post: Post<CheckStatusEvent>): void
}

export type ResetAction = Readonly<{
    reset: ResetPod
}>

export interface ResetPod {
    (locationInfo: ResetLocationInfo): Reset
}
export interface ResetLocationInfo {
    getResetToken(): ResetToken
}
export interface Reset {
    (fields: FormConvertResult<ResetFields>, post: Post<ResetEvent>): void
}

interface Post<T> {
    (state: T): void
}
