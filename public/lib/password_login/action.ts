import { PasswordLoginRequest, PasswordLoginEvent, LoginEvent } from "./data"

export interface PasswordLoginAction {
    (operation: PasswordLoginRequest): void
}
export const initialPasswordLoginAction: PasswordLoginAction = () => {
    throw new Error("Action is not initialized")
}

export interface PasswordLoginInit {
    (setup: Setup<PasswordLoginEventSubscriber>): PasswordLoginResource
}

export type PasswordLoginResource = Readonly<{
    action: PasswordLoginAction
    terminate: Terminate
}>

export interface PasswordLoginEventPublisher {
    postLoginEvent(event: LoginEvent): void
}
export interface PasswordLoginEventSubscriber {
    onLoginEvent(post: Post<LoginEvent>): void
}

export interface PasswordLoginEventMapper {
    mapLoginEvent(event: LoginEvent): PasswordLoginEvent
}

interface Setup<T> {
    (subscriber: T): void
}
interface Post<T> {
    (event: T): void
}
interface Terminate {
    (): void
}
