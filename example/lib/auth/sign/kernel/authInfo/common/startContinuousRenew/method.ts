import { StartContinuousRenewEvent } from "./event"

import { AuthInfo } from "../../kernel/data"
import { SaveAuthInfoResult } from "./data"

export interface SaveAuthInfoMethod {
    (auth: AuthInfo): SaveAuthInfoResult
}

export interface StartContinuousRenewMethod {
    (post: Post<StartContinuousRenewEvent>): void
}

interface Post<E> {
    (event: E): void
}
