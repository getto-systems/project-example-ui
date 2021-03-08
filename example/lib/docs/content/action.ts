import { LoadContentEvent } from "./event"

import { ContentPath } from "./data"
import { LocationTypes } from "../../z_vendor/getto-application/location/infra"

export type ContentAction = Readonly<{
    loadContent: LoadContentPod
}>

export interface LoadContentPod {
    (locationInfo: LoadContentLocationDetecter): LoadContent
}
export interface LoadContent {
    (post: Post<LoadContentEvent>): void
}

type LoadContentLocationTypes = LocationTypes<Readonly<{ version: string }>, ContentPath>
export type LoadContentLocationDetecter = LoadContentLocationTypes["detecter"]
export type LoadContentLocationDetectMethod = LoadContentLocationTypes["method"]
export type LoadContentLocationInfo = LoadContentLocationTypes["info"]
export type LoadContentLocationKeys = LoadContentLocationTypes["keys"]

interface Post<T> {
    (event: T): void
}
