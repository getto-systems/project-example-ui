import { AuthnInfo } from "../common/data"
import {
    ForceStartContinuousRenewAuthnInfoEvent,
    StartContinuousRenewAuthnInfoEvent,
} from "./event"

export interface StartContinuousRenewAuthnInfoMethod {
    (authnInfo: AuthnInfo, post: Post<StartContinuousRenewAuthnInfoEvent>): void
}

export interface ForceStartContinuousRenewAuthnInfoMethod {
    (post: Post<ForceStartContinuousRenewAuthnInfoEvent>): void
}

interface Post<E> {
    (event: E): void
}
