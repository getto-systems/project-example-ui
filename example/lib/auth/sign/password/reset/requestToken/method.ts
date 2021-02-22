import { RequestPasswordResetTokenEvent } from "./event"

import { BoardConvertResult } from "../../../../../z_getto/board/kernel/data"
import { PasswordResetRequestFields } from "./data"

export interface RequestPasswordResetTokenMethod {
    (
        fields: BoardConvertResult<PasswordResetRequestFields>,
        post: Post<RequestPasswordResetTokenEvent>,
    ): void
}

interface Post<T> {
    (state: T): void
}
