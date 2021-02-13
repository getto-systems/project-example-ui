import { LogoutEvent } from "./event"

export type ClearAction = Readonly<{
    logout: LogoutMethod
}>
export type ClearActionPod = Readonly<{
    initLogout: LogoutPod
}>

export interface LogoutPod {
    (): LogoutMethod
}
export interface LogoutMethod {
    (post: Post<LogoutEvent>): void
}

interface Post<E> {
    (event: E): void
}
