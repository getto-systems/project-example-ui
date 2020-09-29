import {
    SessionID, ResetToken,
    StartSessionContent, StartSessionEvent, PollingStatusEvent,
    ResetContent, ResetEvent,
} from "./data"

export interface PasswordResetAction {
    sub: PasswordResetEventSubscriber
    startSession(content: StartSessionContent): void
    startPollingStatus(sessionID: SessionID): void
    reset(resetToken: ResetToken, content: ResetContent): void
}

export interface PasswordResetEventPublisher {
    postStartSessionEvent(event: StartSessionEvent): void
    postPollingStatusEvent(event: PollingStatusEvent): void
    postResetEvent(event: ResetEvent): void
}

export interface PasswordResetEventSubscriber {
    onStartSessionEvent(stateChanged: Post<StartSessionEvent>): void
    onPollingStatusEvent(stateChanged: Post<PollingStatusEvent>): void
    onResetEvent(stateChanged: Post<ResetEvent>): void
}

interface Post<T> {
    (state: T): void
}
