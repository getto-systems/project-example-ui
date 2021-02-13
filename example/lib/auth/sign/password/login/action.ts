import { SubmitEvent } from "./event"

import { FormConvertResult } from "../../../../common/getto-form/form/data"
import { LoginFields } from "./data"

export type LoginActionPod = Readonly<{
    initSubmit: SubmitPod
}>
export type LoginAction = Readonly<{
    submit: SubmitMethod
}>

export interface SubmitPod {
    (): SubmitMethod
}
export interface SubmitMethod {
    (fields: FormConvertResult<LoginFields>, post: Post<SubmitEvent>): void
}

interface Post<E> {
    (event: E): void
}
