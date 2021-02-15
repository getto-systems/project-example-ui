import { ForceRequestRenewAuthCredentialEvent, RequestRenewAuthCredentialEvent } from "./event"

export type RenewAuthCredentialAction = Readonly<{
    request: RequestRenewAuthCredentialMethod
    forceRequest: ForceRequestRenewAuthCredentialMethod
}>

export interface RequestRenewAuthCredentialPod {
    (): RequestRenewAuthCredentialMethod
}
export interface RequestRenewAuthCredentialMethod {
    (post: Post<RequestRenewAuthCredentialEvent>): void
}

export interface ForceRequestRenewAuthCredentialPod {
    (): ForceRequestRenewAuthCredentialMethod
}
export interface ForceRequestRenewAuthCredentialMethod {
    (post: Post<ForceRequestRenewAuthCredentialEvent>): void
}

interface Post<E> {
    (event: E): void
}
