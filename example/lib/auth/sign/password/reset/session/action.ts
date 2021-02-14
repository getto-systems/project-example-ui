import { CheckStatusEvent, StartSessionEvent } from "./event"

import { FormConvertResult } from "../../../../../vendor/getto-form/form/data"
import { SessionID, StartSessionFields } from "./data"

export type SessionAction = Readonly<{
    startSession: StartSessionMethod
    checkStatus: CheckStatusMethod
}>
export type SessionActionPod = Readonly<{
    initStartSession: StartSessionPod
    initCheckStatus: CheckStatusPod
}>

export interface StartSessionPod {
    (): StartSessionMethod
}
export interface StartSessionMethod {
    (fields: FormConvertResult<StartSessionFields>, post: Post<StartSessionEvent>): void
}

export interface CheckStatusPod {
    (): CheckStatusMethod
}
export interface CheckStatusMethod {
    (sessionID: SessionID, post: Post<CheckStatusEvent>): void
}

interface Post<T> {
    (state: T): void
}
