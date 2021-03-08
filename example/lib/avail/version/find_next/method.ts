import { FindNextVersionEvent } from "./event"

import { ApplicationTargetPath } from "./data"
import { LocationTypes } from "../../../z_vendor/getto-application/location/detecter"

export interface FindNextVersionPod {
    (detecter: FindNextVersionLocationDetecter): FindNextVersionMethod
}
export interface FindNextVersionMethod {
    (post: Post<FindNextVersionEvent>): void
}

type FindNextVersionLocationTypes = LocationTypes<Readonly<{ version: string }>, ApplicationTargetPath>
export type FindNextVersionLocationDetecter = FindNextVersionLocationTypes["detecter"]
export type FindNextVersionLocationDetectMethod = FindNextVersionLocationTypes["method"]
export type FindNextVersionLocationInfo = FindNextVersionLocationTypes["info"]
export type FindNextVersionLocationKeys = FindNextVersionLocationTypes["keys"]

interface Post<T> {
    (event: T): void
}
