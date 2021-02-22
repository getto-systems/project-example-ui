import { ResetPasswordEvent } from "./event"

import { PasswordResetFields } from "./data"
import { BoardConvertResult } from "../../../../../z_getto/board/kernel/data"
import { PasswordResetToken } from "../kernel/data"

export interface ResetPasswordPod {
    (locationInfo: ResetPasswordLocationInfo): ResetPasswordMethod
}
export interface ResetPasswordLocationInfo {
    getPasswordResetToken(): PasswordResetToken
}
export interface ResetPasswordMethod {
    (fields: BoardConvertResult<PasswordResetFields>, post: Post<ResetPasswordEvent>): void
}

interface Post<T> {
    (state: T): void
}
