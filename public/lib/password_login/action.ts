import { LoginEvent } from "./data"
import { LoginID } from "../login_id/data"
import { Password } from "../password/data"
import { Content } from "../field/data"

export interface PasswordLoginAction {
    sub: PasswordLoginEventSubscriber
    login(content: [Content<LoginID>, Content<Password>]): Promise<void>
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
