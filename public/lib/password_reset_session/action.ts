import { LoginID } from "../credential/data"
import {
    InputContent,
    Session, SessionError,
    PollingStatus, DoneStatus, PollingStatusError,
} from "./data"
import { Content } from "../field/data"

export interface PasswordResetSessionAction {
    // TODO createSession を startSession にしたい
    createSession_DEPRECATED(event: SessionEventSender, content: [Content<LoginID>]): Promise<SessionResult>
    startPollingStatus_DEPRECATED(event: PollingStatusEventSender, session: Session): Promise<void>
}

export interface SessionEventSender {
    tryToCreateSession(): void
    delayedToCreateSession(): void
    failedToCreateSession(content: InputContent, err: SessionError): void
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
