import { LoginID, AuthCredential } from "../credential/data"
import { Password } from "../password/data"
import { InputContent, ResetEvent, ResetError, ResetToken } from "./data"
import { Content } from "../field/data"

export interface PasswordResetAction {
    sub: PasswordResetEventSubscriber
    reset_DEPRECATED(event: ResetEventSender, resetToken: ResetToken, fields: [Content<LoginID>, Content<Password>]): Promise<ResetResult>
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

export type ResetResult =
    Readonly<{ success: false }> |
    Readonly<{ success: true, authCredential: AuthCredential }>

export interface ResetEventSender {
    tryToReset(): void
    delayedToReset(): void
    failedToReset(content: InputContent, err: ResetError): void
}
