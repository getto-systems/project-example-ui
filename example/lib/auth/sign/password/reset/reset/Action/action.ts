import { ApplicationAction } from "../../../../../../z_vendor/getto-application/action/action"

import { SignLinkResource } from "../../../../common/link/Action/resource"
import { ValidateBoardActionState } from "../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { ResetPasswordCoreAction, ResetPasswordCoreState } from "./Core/action"
import { ResetPasswordFormAction } from "./Form/action"

export type ResetPasswordEntryPoint = Readonly<{
    resource: ResetPasswordResource
    terminate: { (): void }
}>

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
