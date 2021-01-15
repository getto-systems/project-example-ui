import { FindCurrentVersionEvent } from "./data"

export type CurrentVersionAction = Readonly<{
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
