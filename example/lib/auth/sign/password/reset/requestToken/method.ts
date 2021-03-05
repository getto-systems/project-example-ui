import { RequestResetTokenEvent } from "./event"

import { ConvertBoardResult } from "../../../../../z_vendor/getto-application/board/kernel/data"
import { RequestResetTokenFields } from "./data"

export interface RequestResetTokenMethod {
    (fields: ConvertBoardResult<RequestResetTokenFields>, post: Post<RequestResetTokenEvent>): void
}

interface Post<T> {
    (state: T): void
}
