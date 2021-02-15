import { CheckPasswordResetSessionStatusEvent, StartPasswordResetSessionEvent } from "./event"

import { FormConvertResult } from "../../../../../vendor/getto-form/form/data"
import { PasswordResetSessionID, PasswordResetSessionFields } from "./data"

export type PasswordResetSessionAction = Readonly<{
    start: StartPasswordResetSessionMethod
    checkStatus: CheckPasswordResetSessionStatusMethod
}>
export type PasswordResetSessionActionPod = Readonly<{
    initStart: StartPasswordResetSessionPod
    initCheckStatus: CheckPasswordResetSessionStatusPod
}>

export interface StartPasswordResetSessionPod {
    (): StartPasswordResetSessionMethod
}
export interface StartPasswordResetSessionMethod {
    (fields: FormConvertResult<PasswordResetSessionFields>, post: Post<StartPasswordResetSessionEvent>): void
}

export interface CheckPasswordResetSessionStatusPod {
    (): CheckPasswordResetSessionStatusMethod
}
export interface CheckPasswordResetSessionStatusMethod {
    (sessionID: PasswordResetSessionID, post: Post<CheckPasswordResetSessionStatusEvent>): void
}

interface Post<T> {
    (state: T): void
}
