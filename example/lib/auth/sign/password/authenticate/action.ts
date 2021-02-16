import { AuthenticatePasswordEvent } from "./event"

import { FormConvertResult } from "../../../../vendor/getto-form/form/data"
import { PasswordLoginFields } from "./data"

export type AuthenticatePasswordActionPod = Readonly<{
    initAuthenticate: AuthenticatePasswordPod
}>
export type AuthenticatePasswordAction = Readonly<{
    authenticate: AuthenticatePasswordMethod
}>

export interface AuthenticatePasswordPod {
    (): AuthenticatePasswordMethod
}
export interface AuthenticatePasswordMethod {
    (fields: FormConvertResult<PasswordLoginFields>, post: Post<AuthenticatePasswordEvent>): void
}

interface Post<E> {
    (event: E): void
}
