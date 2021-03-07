import { ApplicationEntryPoint } from "../../../../z_vendor/getto-application/action/action"

import { FindNextVersionCoreAction, FindNextVersionCoreActionState } from "./Core/action"

export type FindNextVersionEntryPoint = ApplicationEntryPoint<FindNextVersionResource>

export type FindNextVersionResource = Readonly<{
    findNext: FindNextVersionCoreAction
}>
export type FindNextVersionResourceState = Readonly<{
    state: FindNextVersionCoreActionState
}>
