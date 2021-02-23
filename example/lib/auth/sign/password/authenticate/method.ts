import { AuthenticateEvent } from "./event"

import { BoardConvertResult } from "../../../../z_getto/board/kernel/data"
import { AuthenticateFields } from "./data"

export interface AuthenticateMethod {
    (fields: BoardConvertResult<AuthenticateFields>, post: Post<AuthenticateEvent>): void
}

interface Post<E> {
    (event: E): void
}
