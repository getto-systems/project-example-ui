import { ApplicationStateAction } from "../../../../../z_vendor/getto-application/action/action"

import { FindNextVersionMethod } from "../../method"

import { FindNextVersionEvent } from "../../event"

export type FindNextVersionCoreAction = ApplicationStateAction<FindNextVersionCoreActionState>

export type FindNextVersionMaterial = Readonly<{
    find: FindNextVersionMethod
}>

export type FindNextVersionCoreActionState =
    | Readonly<{ type: "initial-next-version" }>
    | FindNextVersionEvent

export const initialFindNextVersionCoreActionState: FindNextVersionCoreActionState = {
    type: "initial-next-version",
}
