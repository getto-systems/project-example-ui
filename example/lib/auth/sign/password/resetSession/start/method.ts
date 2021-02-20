import { CheckPasswordResetSessionStatusEvent, StartPasswordResetSessionEvent } from "./event"

import { FormConvertResult } from "../../../../../z_getto/getto-form/form/data"
import { PasswordResetSessionID, PasswordResetSessionFields } from "./data"

export interface StartPasswordResetSessionMethod {
    (
        fields: FormConvertResult<PasswordResetSessionFields>,
        post: Post<StartPasswordResetSessionEvent>
    ): void
}

export interface CheckPasswordResetSessionStatusMethod {
    (sessionID: PasswordResetSessionID, post: Post<CheckPasswordResetSessionStatusEvent>): void
}

interface Post<T> {
    (state: T): void
}
