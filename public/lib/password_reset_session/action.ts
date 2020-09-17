import { LoginID } from "../credential/data"
import { CreateSessionEvent, PollingStatusEvent, Session } from "./data"
import { Content } from "../field/data"

export interface PasswordResetSessionAction {
    sub: PasswordResetSessionEventSubscriber
    // TODO createSession を startSession にしたい
    createSession(content: [Content<LoginID>]): Promise<void>
    startPollingStatus(session: Session): Promise<void>
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
