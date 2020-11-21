import {
    SessionID,
    ResetToken,
    StartSessionEvent,
    PollingStatusEvent,
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
    (): Promise<Content<StartSessionFields>>
}

export interface PollingStatusAction {
    (sessionID: SessionID, post: Post<PollingStatusEvent>): void
}

export interface Reset {
    (collectFields: ResetCollector): ResetAction
}
export interface ResetAction {
    (resetToken: ResetToken, post: Post<ResetEvent>): void
}
export interface ResetCollector {
    (): Promise<Content<ResetFields>>
}

interface Post<T> {
    (state: T): void
}
