import {
    ApplicationAction,
    ApplicationView,
} from "../../../../z_vendor/getto-application/action/action"

import { SignLinkResource } from "../../../common/nav/action_nav/resource"
import { ValidateBoardActionState } from "../../../../z_vendor/getto-application/board/action_validate_board/core/action"
import { RequestResetTokenCoreAction, RequestResetTokenCoreState } from "./core/action"
import { RequestResetTokenFormAction } from "./form/action"

export type RequestResetTokenView = ApplicationView<RequestResetTokenResource>

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
