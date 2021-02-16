import { ForceRequestRenewAuthnInfoEvent, RequestRenewAuthnInfoEvent } from "./event"

export type RenewAuthnInfoAction_legacy = Readonly<{
    request: RenewAuthnInfoMethod
    forceRequest: ForceRenewAuthnInfoMethod
}>

export interface RenewAuthnInfoMethod {
    (post: Post<RequestRenewAuthnInfoEvent>): void
}

export interface ForceRenewAuthnInfoMethod {
    (post: Post<ForceRequestRenewAuthnInfoEvent>): void
}

interface Post<E> {
    (event: E): void
}
