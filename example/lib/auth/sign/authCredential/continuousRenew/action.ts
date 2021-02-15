import { AuthCredential } from "../common/data"
import { ForceStartContinuousRenewAuthCredentialEvent, StartContinuousRenewAuthCredentialEvent } from "./event"

export type ContinuousRenewAuthCredentialAction = Readonly<{
    start: StartContinuousRenewAuthCredentialMethod
    forceStart: ForceStartContinuousRenewAuthCredentialMethod
}>

export interface StartContinuousRenewAuthCredentialPod {
    (): StartContinuousRenewAuthCredentialMethod
}
export interface StartContinuousRenewAuthCredentialMethod {
    (authCredential: AuthCredential, post: Post<StartContinuousRenewAuthCredentialEvent>): void
}

export interface ForceStartContinuousRenewAuthCredentialPod {
    (): ForceStartContinuousRenewAuthCredentialMethod
}
export interface ForceStartContinuousRenewAuthCredentialMethod {
    (post: Post<ForceStartContinuousRenewAuthCredentialEvent>): void
}

interface Post<E> {
    (event: E): void
}
