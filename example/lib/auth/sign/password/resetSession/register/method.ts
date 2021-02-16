import { RegisterPasswordResetSessionEvent } from "./event"

import { FormConvertResult } from "../../../../../common/vendor/getto-form/form/data"
import { PasswordResetToken, PasswordResetFields } from "./data"

export interface RegisterPasswordResetSessionPod {
    (
        locationInfo: RegisterPasswordResetSessionLocationInfo
    ): RegisterPasswordResetSessionMethod
}
export interface RegisterPasswordResetSessionLocationInfo {
    getPasswordResetToken(): PasswordResetToken
}
export interface RegisterPasswordResetSessionMethod {
    (
        fields: FormConvertResult<PasswordResetFields>,
        post: Post<RegisterPasswordResetSessionEvent>
    ): void
}

interface Post<T> {
    (state: T): void
}
