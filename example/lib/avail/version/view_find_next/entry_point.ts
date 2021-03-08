import { ApplicationEntryPoint } from "../../../z_vendor/getto-application/action/action"

import { FindNextVersionCoreAction, FindNextVersionCoreState } from "./core/action"

export type FindNextVersionEntryPoint = ApplicationEntryPoint<FindNextVersionResource>

export type FindNextVersionResource = Readonly<{
    findNext: FindNextVersionCoreAction
}>
export type FindNextVersionResourceState = Readonly<{
    state: FindNextVersionCoreState
}>
