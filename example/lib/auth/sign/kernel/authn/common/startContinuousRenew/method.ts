import { Authn } from "../../kernel/data"
import { ForceStartContinuousRenewEvent, StartContinuousRenewEvent } from "./event"

export interface StartContinuousRenewMethod {
    (authnInfo: Authn, post: Post<StartContinuousRenewEvent>): void
}

export interface ForceStartContinuousRenewMethod {
    (post: Post<ForceStartContinuousRenewEvent>): void
}

interface Post<E> {
    (event: E): void
}
