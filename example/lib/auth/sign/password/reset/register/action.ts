import { SubmitPasswordResetRegisterEvent } from "./event"

import { FormConvertResult } from "../../../../../vendor/getto-form/form/data"
import { PasswordResetToken, PasswordResetFields } from "./data"

export type PasswordResetRegisterAction = Readonly<{
    submit: SubmitPasswordResetRegisterMethod
}>
export type PasswordResetRegisterActionPod = Readonly<{
    initSubmit: SubmitPasswordResetRegisterPod
}>
export type PasswordResetRegisterActionLocationInfo = SubmitPasswordResetRegisterLocationInfo

export interface SubmitPasswordResetRegisterPod {
    (locationInfo: SubmitPasswordResetRegisterLocationInfo): SubmitPasswordResetRegisterMethod
}
export interface SubmitPasswordResetRegisterLocationInfo {
    getPasswordResetToken(): PasswordResetToken
}
export interface SubmitPasswordResetRegisterMethod {
    (fields: FormConvertResult<PasswordResetFields>, post: Post<SubmitPasswordResetRegisterEvent>): void
}

interface Post<T> {
    (state: T): void
}
