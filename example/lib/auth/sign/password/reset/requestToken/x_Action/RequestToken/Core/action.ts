import { ApplicationAction } from "../../../../../../../../z_getto/application/action"

import { RequestPasswordResetTokenMethod } from "../../../method"

import { RequestPasswordResetTokenEvent } from "../../../event"

import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"
import { PasswordResetRequestFields } from "../../../data"

export interface RequestPasswordResetTokenCoreAction
    extends ApplicationAction<RequestPasswordResetTokenCoreState> {
    submit(fields: BoardConvertResult<PasswordResetRequestFields>): void
}

export type RequestPasswordResetTokenCoreMaterial = Readonly<{
    request: RequestPasswordResetTokenMethod
}>

export type RequestPasswordResetTokenCoreState =
    | Readonly<{ type: "initial-request-token" }>
    | RequestPasswordResetTokenEvent

export const initialRequestPasswordResetTokenCoreState: RequestPasswordResetTokenCoreState = {
    type: "initial-request-token",
}
