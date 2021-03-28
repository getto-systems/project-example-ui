import { AuthenticatePasswordEvent } from "./event"

import { ConvertBoardResult } from "../../../z_vendor/getto-application/board/kernel/data"
import { AuthenticatePasswordFields } from "./data"

export interface AuthenticatePasswordMethod {
    (
        fields: ConvertBoardResult<AuthenticatePasswordFields>,
        post: Post<AuthenticatePasswordEvent>,
    ): void
}

interface Post<E> {
    (event: E): void
}
