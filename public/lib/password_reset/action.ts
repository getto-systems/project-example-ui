import { SessionID, ResetToken, CreateSessionEvent, PollingStatusEvent, ResetEvent } from "./data"
import { LoginID } from "../login_id/data"
import { Password } from "../password/data"
import { Content } from "../field/data"

export interface PasswordResetAction {
    sub: PasswordResetEventSubscriber
    // TODO createSession を startSession にしたい
    createSession(content: [Content<LoginID>]): Promise<void>
    startPollingStatus(sessionID: SessionID): Promise<void>
    reset(resetToken: ResetToken, fields: [Content<LoginID>, Content<Password>]): Promise<void>
}

export interface PasswordResetEventPublisher {
    dispatchCreateSessionEvent(event: CreateSessionEvent): void
    dispatchPollingStatusEvent(event: PollingStatusEvent): void
    dispatchResetEvent(event: ResetEvent): void
}

export interface PasswordResetEventSubscriber {
    onCreateSessionEvent(stateChanged: Dispatcher<CreateSessionEvent>): void
    onPollingStatusEvent(stateChanged: Dispatcher<PollingStatusEvent>): void
    onResetEvent(stateChanged: Dispatcher<ResetEvent>): void
}

interface Dispatcher<T> {
    (state: T): void
}
