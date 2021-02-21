import { CheckPasswordResetSessionStatusEvent, StartPasswordResetSessionEvent } from "./event"

import { BoardConvertResult } from "../../../../../z_getto/board/kernel/data"
import { PasswordResetSessionID, PasswordResetSessionFields } from "./data"

export interface StartPasswordResetSessionMethod {
    (
        fields: BoardConvertResult<PasswordResetSessionFields>,
        post: Post<StartPasswordResetSessionEvent>,
    ): void
}

export interface CheckPasswordResetSessionStatusMethod {
    (sessionID: PasswordResetSessionID, post: Post<CheckPasswordResetSessionStatusEvent>): void
}

interface Post<T> {
    (state: T): void
}
