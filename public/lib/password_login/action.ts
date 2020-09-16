import { AuthCredential, LoginID } from "../credential/data"
import { Password } from "../password/data"
import { InputContent, LoginEvent, LoginError } from "./data"
import { Content } from "../field/data"

export interface PasswordLoginAction {
    sub: PasswordLoginEventSubscriber
    login(content: [Content<LoginID>, Content<Password>]): Promise<void>
    loginDeprecated(event: LoginEventPublisher, content: [Content<LoginID>, Content<Password>]): Promise<LoginResult>
}

export interface PasswordLoginEventPublisher {
    publishLoginEvent(event: LoginEvent): void
}

export interface PasswordLoginEventSubscriber {
    onLoginEvent(stateChanged: Publisher<LoginEvent>): void
}

interface Publisher<T> {
    (state: T): void
}

export interface LoginEventPublisher {
    tryToLogin(): void
    delayedToLogin(): void
    failedToLogin(content: InputContent, err: LoginError): void
}

export type LoginResult =
    Readonly<{ success: false }> |
    Readonly<{ success: true, authCredential: AuthCredential }>
