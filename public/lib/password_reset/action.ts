import { SessionID, ResetToken, StartSessionEvent, PollingStatusEvent, ResetEvent } from "./data"
import { LoginID } from "../login_id/data"
import { Password } from "../password/data"
import { Content } from "../field/data"

export interface PasswordResetAction {
    sub: PasswordResetEventSubscriber
    startSession(content: [Content<LoginID>]): Promise<void>
    startPollingStatus(sessionID: SessionID): Promise<void>
    reset(resetToken: ResetToken, fields: [Content<LoginID>, Content<Password>]): Promise<void>
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
