import {
    SessionID, ResetToken,
    StartSessionContent, StartSessionEvent, PollingStatusEvent,
    ResetContent, ResetEvent,
} from "./data"

export interface SessionAction {
    startSession(content: StartSessionContent): void
    startPollingStatus(sessionID: SessionID): void
}

export interface SessionFactory {
    (): SessionResource
}
export type SessionResource = Readonly<{
    action: SessionAction
    subscriber: SessionSubscriber
}>

export interface ResetAction {
    (resetToken: ResetToken, content: ResetContent): void
}

export interface ResetFactory {
    (): ResetResource
}
export type ResetResource = Readonly<{
    action: ResetAction
    subscriber: ResetSubscriber
}>

export interface SessionSubscriber {
    onStartSessionEvent(stateChanged: Post<StartSessionEvent>): void
    onPollingStatusEvent(stateChanged: Post<PollingStatusEvent>): void
}

export interface ResetSubscriber {
    onResetEvent(stateChanged: Post<ResetEvent>): void
}

interface Post<T> {
    (state: T): void
}
