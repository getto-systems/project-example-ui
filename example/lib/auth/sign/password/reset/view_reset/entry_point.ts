import {
    ApplicationAction,
    ApplicationEntryPoint,
} from "../../../../../z_vendor/getto-application/action/action"

import { SignLinkResource } from "../../../common/link/action/resource"
import { ValidateBoardActionState } from "../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { ResetPasswordCoreAction, ResetPasswordCoreState } from "./core/action"
import { ResetPasswordFormAction } from "./form/action"

export type ResetPasswordEntryPoint = ApplicationEntryPoint<ResetPasswordResource>

export type ResetPasswordResource = SignLinkResource & Readonly<{ reset: ResetPasswordAction }>

export interface ResetPasswordAction extends ApplicationAction {
    readonly core: ResetPasswordCoreAction
    readonly form: ResetPasswordFormAction
}

export type ResetPasswordResourceState = Readonly<{
    state: Readonly<{
        core: ResetPasswordCoreState
        form: ValidateBoardActionState
    }>
}>
