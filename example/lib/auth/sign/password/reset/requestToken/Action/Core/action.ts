import { ApplicationStateAction } from "../../../../../../../z_vendor/getto-application/action/action"

import { RequestResetTokenMethod } from "../../method"

import { RequestResetTokenEvent } from "../../event"

import { ConvertBoardResult } from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { RequestResetTokenFields } from "../../data"

export interface RequestResetTokenCoreAction
    extends ApplicationStateAction<RequestResetTokenCoreState> {
    submit(fields: ConvertBoardResult<RequestResetTokenFields>): void
}

export type RequestResetTokenCoreMaterial = Readonly<{
    requestToken: RequestResetTokenMethod
}>

export type RequestResetTokenCoreState =
    | Readonly<{ type: "initial-request-token" }>
    | RequestResetTokenEvent

export const initialRequestResetTokenCoreState: RequestResetTokenCoreState = {
    type: "initial-request-token",
}
