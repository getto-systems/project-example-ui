import { AuthnInfo } from "../../kernel/data"
import { ForceStartContinuousRenewEvent, StartContinuousRenewEvent } from "./event"

export interface StartContinuousRenewMethod {
    (authnInfo: AuthnInfo, post: Post<StartContinuousRenewEvent>): void
}

export interface ForceStartContinuousRenewMethod {
    (post: Post<ForceStartContinuousRenewEvent>): void
}

interface Post<E> {
    (event: E): void
}
