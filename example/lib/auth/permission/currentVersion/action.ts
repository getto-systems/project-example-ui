import { FindCurrentVersionEvent } from "./event"

export type FindCurrentVersionAction = Readonly<{
    findCurrentVersion: FindCurrentVersionPod
}>

export interface FindCurrentVersionPod {
    (): FindCurrentVersion
}
export interface FindCurrentVersion {
    (post: Post<FindCurrentVersionEvent>): void
}

interface Post<T> {
    (event: T): void
}
