import { AppTarget, FindEvent } from "./data"

export interface Find {
    (collector: FindCollector): FindAction
}
export interface FindAction {
    (post: Post<FindEvent>): void
}
export interface FindCollector {
    getAppTarget(): AppTarget
}

interface Post<T> {
    (event: T): void
}
