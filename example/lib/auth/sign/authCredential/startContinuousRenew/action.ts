import { AuthCredential } from "../common/data"
import { ForceStartContinuousRenewAuthCredentialEvent, StartContinuousRenewAuthCredentialEvent } from "./event"

export type StartContinuousRenewAuthCredentialAction = Readonly<{
    start: StartContinuousRenewAuthCredentialMethod
    forceStart: ForceStartContinuousRenewAuthCredentialMethod
}>

export interface StartContinuousRenewAuthCredentialMethod {
    (authCredential: AuthCredential, post: Post<StartContinuousRenewAuthCredentialEvent>): void
}

export interface ForceStartContinuousRenewAuthCredentialMethod {
    (post: Post<ForceStartContinuousRenewAuthCredentialEvent>): void
}

interface Post<E> {
    (event: E): void
}
