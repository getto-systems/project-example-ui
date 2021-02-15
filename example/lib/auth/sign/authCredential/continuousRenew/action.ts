import { AuthCredential } from "../common/data"
import { ForceStartEvent, StartEvent } from "./event"

export type ContinuousRenewAction = Readonly<{
    start: StartMethod
    forceStart: ForceStartMethod
}>

export interface StartPod {
    (): StartMethod
}
export interface StartMethod {
    (authCredential: AuthCredential, post: Post<StartEvent>): void
}

export interface ForceStartPod {
    (): ForceStartMethod
}
export interface ForceStartMethod {
    (post: Post<ForceStartEvent>): void
}

interface Post<E> {
    (event: E): void
}
