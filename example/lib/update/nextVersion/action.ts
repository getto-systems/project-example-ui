import { FindEvent } from "./event"

import { AppTarget } from "./data"

export type NextVersionAction = Readonly<{
    find: FindPod
}>

export interface FindPod {
    (locationInfo: FindLocationInfo): Find
}
export interface Find {
    (post: Post<FindEvent>): void
}
export interface FindLocationInfo {
    getAppTarget(): AppTarget
}

interface Post<T> {
    (event: T): void
}
