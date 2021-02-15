import { SubmitPasswordLoginEvent } from "./event"

import { FormConvertResult } from "../../../../vendor/getto-form/form/data"
import { PasswordLoginFields } from "./data"

export type PasswordLoginActionPod = Readonly<{
    initSubmit: SubmitPasswordLoginPod
}>
export type PasswordLoginAction = Readonly<{
    submit: SubmitPasswordLoginMethod
}>

export interface SubmitPasswordLoginPod {
    (): SubmitPasswordLoginMethod
}
export interface SubmitPasswordLoginMethod {
    (fields: FormConvertResult<PasswordLoginFields>, post: Post<SubmitPasswordLoginEvent>): void
}

interface Post<E> {
    (event: E): void
}
