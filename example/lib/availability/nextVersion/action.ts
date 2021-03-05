import { FindEvent } from "./event"

import { AppTarget } from "./data"
import { LocationTypes } from "../../z_vendor/getto-application/location/detecter"

export type NextVersionAction = Readonly<{
    find: FindPod
}>

export interface FindPod {
    (detecter: FindLocationDetecter): Find
}
export interface Find {
    (post: Post<FindEvent>): void
}

type FindLocationTypes = LocationTypes<Readonly<{ version: string }>, AppTarget>
export type FindLocationDetecter = FindLocationTypes["detecter"]
export type FindLocationDetectMethod = FindLocationTypes["method"]
export type FindLocationInfo = FindLocationTypes["info"]
export type FindLocationKeys = FindLocationTypes["keys"]

interface Post<T> {
    (event: T): void
}
