import { ForceRequestRenewAuthnInfoEvent, RequestRenewAuthnInfoEvent } from "./event"

export interface RenewAuthnInfoMethod {
    (post: Post<RequestRenewAuthnInfoEvent>): void
}

export interface ForceRenewAuthnInfoMethod {
    (post: Post<ForceRequestRenewAuthnInfoEvent>): void
}

interface Post<E> {
    (event: E): void
}
