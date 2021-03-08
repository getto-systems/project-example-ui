import { ApplicationAction, ApplicationEntryPoint } from "../../../../../z_vendor/getto-application/action/action"

import { SignLinkResource } from "../../../common/link/action/resource"
import { ValidateBoardActionState } from "../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { RequestResetTokenCoreAction, RequestResetTokenCoreState } from "./core/action"
import { RequestResetTokenFormAction } from "./form/action"

export type RequestResetTokenEntryPoint = ApplicationEntryPoint<RequestResetTokenResource>

export type RequestResetTokenResource = SignLinkResource &
    Readonly<{ requestToken: RequestResetTokenAction }>

export interface RequestResetTokenAction extends ApplicationAction {
    readonly core: RequestResetTokenCoreAction
    readonly form: RequestResetTokenFormAction
}

export type RequestResetTokenResourceState = Readonly<{
    state: Readonly<{
        core: RequestResetTokenCoreState
        form: ValidateBoardActionState
    }>
}>
