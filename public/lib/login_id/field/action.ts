import { LoginIDFieldEvent } from "./data"
import { LoginID } from "../data"
import { Content, InputValue } from "../../field/data"

export interface LoginIDFieldAction {
    set(input: InputValue): void
    validate(): Content<LoginID>
}

export interface LoginIDFieldFactory {
    (): LoginIDFieldResource
}
export type LoginIDFieldResource = Readonly<{
    action: LoginIDFieldAction
    subscriber: LoginIDFieldSubscriber
}>

export interface LoginIDFieldSubscriber {
    onLoginIDFieldEvent(post: Post<LoginIDFieldEvent>): void
}

interface Post<T> {
    (event: T): void
}
