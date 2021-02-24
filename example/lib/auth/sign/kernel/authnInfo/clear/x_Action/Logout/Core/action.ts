import { ApplicationStateAction } from "../../../../../../../../z_getto/application/action"

import { ClearMethod } from "../../../method"

import { ClearEvent } from "../../../event"

export interface CoreAction extends ApplicationStateAction<CoreState> {
    submit(): void
}

export type CoreMaterial = Readonly<{
    clear: ClearMethod
}>

export type CoreState = Readonly<{ type: "initial-logout" }> | ClearEvent

export const initialCoreState: CoreState = {
    type: "initial-logout",
}
