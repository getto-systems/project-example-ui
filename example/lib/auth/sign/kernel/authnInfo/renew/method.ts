import { ForceRenewAuthnInfoEvent, RenewAuthnInfoEvent } from "./event"

export interface RenewAuthnInfoMethod {
    (post: Post<RenewAuthnInfoEvent>): void
}

export interface ForceRenewAuthnInfoMethod {
    (post: Post<ForceRenewAuthnInfoEvent>): void
}

interface Post<E> {
    (event: E): void
}
