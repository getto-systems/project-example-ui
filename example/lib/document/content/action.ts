import { ContentPath, LoadContentEvent } from "./data"

export type ContentAction = Readonly<{
    loadContent: LoadContentPod
}>

export interface LoadContentPod {
    (collector: LoadContentCollector): LoadContent
}
export interface LoadContent {
    (post: Post<LoadContentEvent>): void
}
export interface LoadContentCollector {
    getContentPath(): ContentPath
}

interface Post<T> {
    (event: T): void
}
