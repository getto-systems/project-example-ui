import {
    SessionID, ResetToken,
    StartSessionEvent, PollingStatusEvent,
    ResetEvent,
} from "./data"

export interface StartSessionAction {
    (post: Post<StartSessionEvent>): void
}

export interface PollingStatusAction {
    (sessionID: SessionID, post: Post<PollingStatusEvent>): void
}

export interface ResetAction {
    (resetToken: ResetToken, post: Post<ResetEvent>): void
}

interface Post<T> {
    (state: T): void
}
