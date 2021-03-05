import { ApplicationAction } from "../../../../../../z_vendor/getto-application/action/action"

import { SignLinkResource } from "../../../../common/link/Action/action"
import { ValidateBoardActionState } from "../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { RequestResetTokenCoreAction, RequestResetTokenCoreState } from "./Core/action"
import { RequestResetTokenFormAction } from "./Form/action"

export type RequestResetTokenEntryPoint = Readonly<{
    resource: RequestResetTokenResource
    terminate: { (): void }
}>

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
