import { ApplicationStateAction } from "../../../../z_vendor/getto-application/action/action"

import { Find } from "../../../nextVersion/action"

import { FindEvent } from "../../../nextVersion/event"

export interface NextVersionComponentFactory {
    (material: NextVersionMaterial): NextVersionComponent
}
export type NextVersionMaterial = Readonly<{
    find: Find
}>

export type NextVersionComponent = ApplicationStateAction<NextVersionComponentState>

export type NextVersionComponentState = Readonly<{ type: "initial-next-version" }> | FindEvent

export const initialNextVersionComponentState: NextVersionComponentState = {
    type: "initial-next-version",
}
