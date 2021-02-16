import { AuthenticatePasswordEvent } from "./event"

import { FormConvertResult } from "../../../../common/vendor/getto-form/form/data"
import { AuthenticatePasswordFields } from "./data"

export interface AuthenticatePasswordMethod {
    (
        fields: FormConvertResult<AuthenticatePasswordFields>,
        post: Post<AuthenticatePasswordEvent>
    ): void
}

interface Post<E> {
    (event: E): void
}
