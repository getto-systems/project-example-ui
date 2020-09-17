import { LoginID } from "../credential/data"
import {
    InputContent,
    CreateSessionEvent, PollingStatusEvent,
    Session, CreateSessionError,
    PollingStatus, DoneStatus, PollingStatusError,
} from "./data"
import { Content } from "../field/data"

export interface PasswordResetSessionAction {
    sub: PasswordResetSessionEventSubscriber
    // TODO createSession を startSession にしたい
    createSession(content: [Content<LoginID>]): Promise<void>
    startPollingStatus(session: Session): Promise<void>

    createSession_DEPRECATED(event: SessionEventSender, content: [Content<LoginID>]): Promise<SessionResult>
    startPollingStatus_DEPRECATED(event: PollingStatusEventSender, session: Session): Promise<void>
}

export interface PasswordResetSessionEventPublisher {
    publishCreateSessionEvent(event: CreateSessionEvent): void
    publishPollingStatusEvent(event: PollingStatusEvent): void
}

export interface PasswordResetSessionEventSubscriber {
    onCreateSessionEvent(stateChanged: Publisher<CreateSessionEvent>): void
    onPollingStatusEvent(stateChanged: Publisher<PollingStatusEvent>): void
}

interface Publisher<T> {
    (state: T): void
}

export interface SessionEventSender {
    tryToCreateSession(): void
    delayedToCreateSession(): void
    failedToCreateSession(content: InputContent, err: CreateSessionError): void
}
export interface PollingStatusEventSender {
    tryToPollingStatus(): void
    retryToPollingStatus(status: PollingStatus): void
    failedToPollingStatus(err: PollingStatusError): void

    succeedToSendToken(status: DoneStatus): void
}

export type SessionResult =
    Readonly<{ success: false }> |
    Readonly<{ success: true, session: Session }>
