import { ForceRequestEvent, RequestEvent } from "./event"

export type RenewAction = Readonly<{
    request: RequestMethod
    forceRequest: ForceRequestMethod
}>
export type RenewActionPod = Readonly<{
    initRequest: RequestPod
    initForceRequest: ForceRequestPod
}>

export interface RequestPod {
    (): RequestMethod
}
export interface RequestMethod {
    (post: Post<RequestEvent>): void
}

export interface ForceRequestPod {
    (): ForceRequestMethod
}
export interface ForceRequestMethod {
    (post: Post<ForceRequestEvent>): void
}

interface Post<E> {
    (event: E): void
}
