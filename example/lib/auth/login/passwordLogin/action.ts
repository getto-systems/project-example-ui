import { LoginEvent } from "./event"

import { FormConvertResult } from "../../../sub/getto-form/action/data"
import { LoginFields } from "./data"

export type PasswordLoginAction = Readonly<{
    login: LoginPod
}>

export interface LoginPod {
    (): Login
}
export interface Login {
    (fields: FormConvertResult<LoginFields>, post: Post<LoginEvent>): void
}

interface Post<T> {
    (event: T): void
}
