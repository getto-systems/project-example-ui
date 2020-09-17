import {
    Session,
    ResetToken,
    CreateSessionEvent,
    PollingStatusEvent,
    ResetEvent,
} from "./data"

import { LoginID } from "../credential/data"
import { Password } from "../password/data"
import { Content } from "../field/data"

export interface PasswordResetAction {
    sub: PasswordResetEventSubscriber
    // TODO createSession を startSession にしたい
    createSession(content: [Content<LoginID>]): Promise<void>
    startPollingStatus(session: Session): Promise<void>
    reset(resetToken: ResetToken, fields: [Content<LoginID>, Content<Password>]): Promise<void>
}

export interface PasswordResetEventPublisher {
    publishCreateSessionEvent(event: CreateSessionEvent): void
    publishPollingStatusEvent(event: PollingStatusEvent): void
    publishResetEvent(event: ResetEvent): void
}

export interface PasswordResetEventSubscriber {
    onCreateSessionEvent(stateChanged: Publisher<CreateSessionEvent>): void
    onPollingStatusEvent(stateChanged: Publisher<PollingStatusEvent>): void
    onResetEvent(stateChanged: Publisher<ResetEvent>): void
}

interface Publisher<T> {
    (state: T): void
}
