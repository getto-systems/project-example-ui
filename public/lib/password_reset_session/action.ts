import { LoginID } from "../auth_credential/data";
import {
    InputContent,
    Session, SessionError,
    PollingStatus, DoneStatus, PollingStatusError,
} from "./data";
import { Content } from "../input/data";

export interface PasswordResetSessionAction {
    createSession(event: SessionEvent, content: [Content<LoginID>]): Promise<SessionResult>
    startPollingStatus(event: PollingStatusEvent, session: Session): Promise<void>
}

export interface SessionEvent {
    tryToCreateSession(): void
    delayedToCreateSession(): void
    failedToCreateSession(content: InputContent, err: SessionError): void
}
export interface PollingStatusEvent {
    tryToPollingStatus(): void
    retryToPollingStatus(status: PollingStatus): void
    failedToPollingStatus(err: PollingStatusError): void

    succeedToSendToken(status: DoneStatus): void
}

export type SessionResult =
    Readonly<{ success: false }> |
    Readonly<{ success: true, session: Session }>
