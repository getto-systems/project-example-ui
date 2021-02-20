import { RegisterPasswordEvent } from "./event"

import { FormConvertResult } from "../../../../../z_getto/getto-form/form/data"
import { PasswordResetToken, PasswordResetFields } from "./data"

export interface RegisterPasswordPod {
    (locationInfo: RegisterPasswordLocationInfo): RegisterPasswordMethod
}
export interface RegisterPasswordLocationInfo {
    getPasswordResetToken(): PasswordResetToken
}
export interface RegisterPasswordMethod {
    (
        fields: FormConvertResult<PasswordResetFields>,
        post: Post<RegisterPasswordEvent>
    ): void
}

interface Post<T> {
    (state: T): void
}
