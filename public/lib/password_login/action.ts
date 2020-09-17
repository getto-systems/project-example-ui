import { LoginID } from "../credential/data"
import { Password } from "../password/data"
import { LoginEvent } from "./data"
import { Content } from "../field/data"

export interface PasswordLoginAction {
    sub: PasswordLoginEventSubscriber
    login(content: [Content<LoginID>, Content<Password>]): Promise<void>
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
