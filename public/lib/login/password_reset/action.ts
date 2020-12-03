import {
    SessionID,
    ResetToken,
    StartSessionEvent,
    CheckStatusEvent,
    ResetEvent,
    StartSessionFields,
    ResetFields,
} from "./data"
import { Content } from "../field/data"

export interface StartSession {
    (collector: StartSessionCollector): StartSessionAction
}
export interface StartSessionAction {
    (post: Post<StartSessionEvent>): void
}
export interface StartSessionCollector {
    getFields(): Promise<Content<StartSessionFields>>
}

export interface CheckStatus {
    (): CheckStatusAction
}
export interface CheckStatusAction {
    (sessionID: SessionID, post: Post<CheckStatusEvent>): void
}

export interface Reset {
    (collector: ResetCollector): ResetAction
}
export interface ResetAction {
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
