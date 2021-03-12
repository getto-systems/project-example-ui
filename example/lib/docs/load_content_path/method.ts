import { LocationTypes } from "../../z_vendor/getto-application/location/infra"

import { DocsContentPath } from "./data"

export interface LoadDocsContentPathPod {
    (detecter: LoadDocsContentPathLocationDetecter): LoadDocsContentPathMethod
}
export interface LoadDocsContentPathMethod {
    (): DocsContentPath
}

type LoadDocsContentPathLocationTypes = LocationTypes<DocsContentPath>
export type LoadDocsContentPathLocationDetecter = LoadDocsContentPathLocationTypes["detecter"]
export type LoadDocsContentPathLocationDetectMethod = LoadDocsContentPathLocationTypes["method"]
export type LoadDocsContentPathLocationInfo = LoadDocsContentPathLocationTypes["info"]
export type LoadDocsContentPathLocationKeys = Readonly<{ version: string }>
