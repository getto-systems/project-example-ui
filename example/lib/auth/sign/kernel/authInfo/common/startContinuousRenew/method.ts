import { AuthInfo } from "../../kernel/data"
import { ForceStartContinuousRenewEvent, StartContinuousRenewEvent } from "./event"

export interface StartContinuousRenewMethod {
    (auth: AuthInfo, post: Post<StartContinuousRenewEvent>): void
}

export interface ForceStartContinuousRenewMethod {
    (post: Post<ForceStartContinuousRenewEvent>): void
}

interface Post<E> {
    (event: E): void
}
