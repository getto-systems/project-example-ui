import { ApplicationStateAction } from "../../../../../../../../z_vendor/getto-application/action/action"

import { RequestTokenMethod } from "../../../method"

import { RequestTokenEvent } from "../../../event"

import { ConvertBoardResult } from "../../../../../../../../z_vendor/getto-application/board/kernel/data"
import { RequestTokenFields } from "../../../data"

export interface CoreAction extends ApplicationStateAction<CoreState> {
    submit(fields: ConvertBoardResult<RequestTokenFields>): void
}

export type CoreMaterial = Readonly<{
    requestToken: RequestTokenMethod
}>

export type CoreState = Readonly<{ type: "initial-request-token" }> | RequestTokenEvent

export const initialCoreState: CoreState = {
    type: "initial-request-token",
}
