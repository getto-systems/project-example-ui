import { ApplicationStateAction } from "../../../../../../../../z_getto/action/action"

import { RequestTokenMethod } from "../../../method"

import { RequestTokenEvent } from "../../../event"

import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"
import { RequestTokenFields } from "../../../data"

export interface CoreAction extends ApplicationStateAction<CoreState> {
    submit(fields: BoardConvertResult<RequestTokenFields>): void
}

export type CoreMaterial = Readonly<{
    requestToken: RequestTokenMethod
}>

export type CoreState = Readonly<{ type: "initial-request-token" }> | RequestTokenEvent

export const initialCoreState: CoreState = {
    type: "initial-request-token",
}
