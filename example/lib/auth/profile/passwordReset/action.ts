import { CheckStatusEvent, ResetEvent, StartSessionEvent } from "./event"

import { SessionID, ResetToken, StartSessionFields, ResetFields } from "./data"
import { FormConvertResult } from "../../../sub/getto-form/action/data"

export type PasswordResetSessionAction = Readonly<{
    startSession: StartSessionPod
    checkStatus: CheckStatusPod
}>
export type PasswordResetAction = Readonly<{
    reset: ResetPod
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

export interface ResetPod {
    (locationInfo: ResetLocationInfo): Reset
}
export interface Reset {
    (fields: FormConvertResult<ResetFields>, post: Post<ResetEvent>): void
}
export interface ResetLocationInfo {
    getResetToken(): ResetToken
}

interface Post<T> {
    (state: T): void
}
