import { ApplicationAction } from "../../../../../../../z_getto/application/action"
import {
    initialValidateBoardState,
    ValidateBoardState,
} from "../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { AuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/action"
import {
    initialResetPasswordCoreState,
    ResetPasswordCoreAction,
    ResetPasswordCoreState,
} from "./Core/action"
import { ResetPasswordFormAction } from "./Form/action"

export type ResetPasswordEntryPoint = Readonly<{
    resource: ResetPasswordResource
    terminate: { (): void }
}>

export type ResetPasswordResource = AuthSignLinkResource & Readonly<{ reset: ResetPasswordAction }>

export interface ResetPasswordAction extends ApplicationAction {
    readonly core: ResetPasswordCoreAction
    readonly form: ResetPasswordFormAction
}

export type ResetPasswordResourceState = Readonly<{
    core: ResetPasswordCoreState
    form: ValidateBoardState
}>
export const initialResetPasswordState: ResetPasswordResourceState = {
    core: initialResetPasswordCoreState,
    form: initialValidateBoardState,
}
