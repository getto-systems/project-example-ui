import { LoginContent, LoginEvent } from "./data"

export interface PasswordLoginAction {
    sub: PasswordLoginEventSubscriber
    login(content: LoginContent): Promise<void>
}

export interface PasswordLoginEventPublisher {
    postLoginEvent(event: LoginEvent): void
}

export interface PasswordLoginEventSubscriber {
    onLoginEvent(stateChanged: Post<LoginEvent>): void
}

interface Post<T> {
    (state: T): void
}
