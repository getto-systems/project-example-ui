import { LoginEvent } from "./event"

import { FormConvertResult } from "../../../common/getto-form/form/data"
import { LoginFields } from "./data"

export type LoginAction = Readonly<{
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
