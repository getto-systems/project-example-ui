import { RegisterPasswordEvent } from "./event"

import { PasswordResetToken, PasswordResetFields } from "./data"
import { BoardConvertResult } from "../../../../../z_getto/board/kernel/data"

export interface RegisterPasswordPod {
    (locationInfo: RegisterPasswordLocationInfo): RegisterPasswordMethod
}
export interface RegisterPasswordLocationInfo {
    getPasswordResetToken(): PasswordResetToken
}
export interface RegisterPasswordMethod {
    (fields: BoardConvertResult<PasswordResetFields>, post: Post<RegisterPasswordEvent>): void
}

interface Post<T> {
    (state: T): void
}
