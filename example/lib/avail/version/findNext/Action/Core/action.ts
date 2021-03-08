import { ApplicationStateAction } from "../../../../../z_vendor/getto-application/action/action"

import { FindNextVersionMethod } from "../../method"

import { FindNextVersionEvent } from "../../event"

export type FindNextVersionCoreAction = ApplicationStateAction<FindNextVersionCoreState>

export type FindNextVersionMaterial = Readonly<{
    find: FindNextVersionMethod
}>

export type FindNextVersionCoreState =
    | Readonly<{ type: "initial-next-version" }>
    | FindNextVersionEvent

export const initialFindNextVersionCoreState: FindNextVersionCoreState = {
    type: "initial-next-version",
}
