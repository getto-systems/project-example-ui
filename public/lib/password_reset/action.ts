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
    dispatchStartSessionEvent(event: StartSessionEvent): void
    dispatchPollingStatusEvent(event: PollingStatusEvent): void
    dispatchResetEvent(event: ResetEvent): void
}

export interface PasswordResetEventSubscriber {
    onStartSessionEvent(stateChanged: Dispatcher<StartSessionEvent>): void
    onPollingStatusEvent(stateChanged: Dispatcher<PollingStatusEvent>): void
    onResetEvent(stateChanged: Dispatcher<ResetEvent>): void
}

interface Dispatcher<T> {
    (state: T): void
}
