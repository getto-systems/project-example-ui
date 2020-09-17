import { LoginID } from "../credential/data"
import { Password } from "../password/data"
import { ResetEvent, ResetToken } from "./data"
import { Content } from "../field/data"

export interface PasswordResetAction {
    sub: PasswordResetEventSubscriber
    reset(resetToken: ResetToken, fields: [Content<LoginID>, Content<Password>]): Promise<void>
}

export interface PasswordResetEventPublisher {
    publishResetEvent(event: ResetEvent): void
}

export interface PasswordResetEventSubscriber {
    onResetEvent(stateChanged: Publisher<ResetEvent>): void
}

interface Publisher<T> {
    (state: T): void
}
