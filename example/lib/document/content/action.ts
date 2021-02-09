import { LoadContentEvent } from "./event"

import { ContentPath } from "./data"

export type ContentAction = Readonly<{
    loadContent: LoadContentPod
}>

export interface LoadContentPod {
    (locationInfo: LoadContentLocationInfo): LoadContent
}
export interface LoadContent {
    (post: Post<LoadContentEvent>): void
}
export interface LoadContentLocationInfo {
    getContentPath(): ContentPath
}

interface Post<T> {
    (event: T): void
}
