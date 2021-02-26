import { AuthenticateEvent } from "./event"

import { BoardConvertResult } from "../../../../z_vendor/getto-application/board/kernel/data"
import { AuthenticateFields } from "./data"

export interface AuthenticateMethod {
    (fields: BoardConvertResult<AuthenticateFields>, post: Post<AuthenticateEvent>): void
}

interface Post<E> {
    (event: E): void
}
