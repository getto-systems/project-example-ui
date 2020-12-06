import { LoginEvent, LoginFields } from "./data"
import { Content } from "../../common/field/data"

export type PasswordLoginAction = Readonly<{
    login: LoginPod
}>

export interface LoginPod {
    (collector: LoginCollector): Login
}
export interface Login {
    (post: Post<LoginEvent>): void
}
export interface LoginCollector {
    getFields(): Promise<Content<LoginFields>>
}

interface Post<T> {
    (event: T): void
}
