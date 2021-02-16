import { AuthenticatePasswordEvent } from "./event"

import { FormConvertResult } from "../../../../common/vendor/getto-form/form/data"
import { PasswordLoginFields } from "./data"

export type AuthenticatePasswordActionPod_legacy = Readonly<{
    initAuthenticate: AuthenticatePasswordPod
}>
export type AuthenticatePasswordAction_legacy = Readonly<{
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
