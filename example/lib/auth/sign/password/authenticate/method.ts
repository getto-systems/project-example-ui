import { AuthenticatePasswordEvent } from "./event"

import { BoardConvertResult } from "../../../../z_getto/board/kernel/data"
import { AuthenticatePasswordFields } from "./data"

export interface AuthenticatePasswordMethod {
    (
        fields: BoardConvertResult<AuthenticatePasswordFields>,
        post: Post<AuthenticatePasswordEvent>,
    ): void
}

interface Post<E> {
    (event: E): void
}
