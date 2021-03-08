import { LoadMenuLocationDetecter } from "../kernel/method"

import { LoadMenuEvent } from "./event"

export interface LoadMenuPod {
    (detecter: LoadMenuLocationDetecter): LoadMenuMethod
}
export interface LoadMenuMethod {
    (post: Post<LoadMenuEvent>): void
}

interface Post<T> {
    (event: T): void
}
