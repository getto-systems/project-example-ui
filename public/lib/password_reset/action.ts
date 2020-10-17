import {
    SessionID, ResetToken,
    StartSessionContent, StartSessionEvent, PollingStatusEvent,
    ResetContent, ResetEvent,
} from "./data"

export interface SessionAction {
    startSession(content: StartSessionContent, post: Post<StartSessionEvent>): void
    startPollingStatus(sessionID: SessionID, post: Post<PollingStatusEvent>): void
}

export interface ResetAction {
    (resetToken: ResetToken, content: ResetContent, post: Post<ResetEvent>): void
}

interface Post<T> {
    (state: T): void
}
