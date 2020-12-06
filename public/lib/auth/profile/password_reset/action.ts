import {
    SessionID,
    ResetToken,
    StartSessionEvent,
    CheckStatusEvent,
    ResetEvent,
    StartSessionFields,
    ResetFields,
} from "./data"
import { Content } from "../../common/field/data"

export type PasswordResetSessionAction = Readonly<{
    startSession: StartSessionPod
    checkStatus: CheckStatusPod
}>
export type PasswordResetAction = Readonly<{
    reset: ResetPod
}>

export interface StartSessionPod {
    (collector: StartSessionCollector): StartSession
}
export interface StartSession {
    (post: Post<StartSessionEvent>): void
}
export interface StartSessionCollector {
    getFields(): Promise<Content<StartSessionFields>>
}

export interface CheckStatusPod {
    (): CheckStatus
}
export interface CheckStatus {
    (sessionID: SessionID, post: Post<CheckStatusEvent>): void
}

export interface ResetPod {
    (collector: ResetCollector): Reset
}
export interface Reset {
    (post: Post<ResetEvent>): void
}
export interface ResetCollector extends ResetTokenCollector {
    getFields(): Promise<Content<ResetFields>>
}
export interface ResetTokenCollector {
    getResetToken(): ResetToken
}

interface Post<T> {
    (state: T): void
}
