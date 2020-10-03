import { PasswordLoginOperation, PasswordLoginEvent, LoginEvent } from "./data"

export interface PasswordLoginRequest {
    (operation: PasswordLoginOperation): void
}
export const initialPasswordLoginRequest: PasswordLoginRequest = () => {
    throw new Error("Action is not initialized")
}

export type PasswordLoginAction = Readonly<{
    request: PasswordLoginRequest
    terminate: Terminate
}>

export interface PasswordLoginInit {
    (setup: Setup<PasswordLoginEventSubscriber>): PasswordLoginAction
}

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
