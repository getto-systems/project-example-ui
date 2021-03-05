import { ApplicationAction } from "../../../../../../../z_vendor/getto-application/action/action"
import {
    initialValidateBoardState,
    ValidateBoardActionState,
} from "../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { SignLinkResource } from "../../../../../common/link/Action/action"
import {
    initialCoreState,
    CoreAction,
    CoreState,
} from "./Core/action"
import { FormAction } from "./Form/action"

export type ResetPasswordEntryPoint = Readonly<{
    resource: ResetPasswordResource
    terminate: { (): void }
}>

export type ResetPasswordResource = SignLinkResource & Readonly<{ reset: ResetPasswordAction }>

export interface ResetPasswordAction extends ApplicationAction {
    readonly core: CoreAction
    readonly form: FormAction
}

export type ResetPasswordResourceState = Readonly<{
    core: CoreState
    form: ValidateBoardActionState
}>
export const initialResetPasswordState: ResetPasswordResourceState = {
    core: initialCoreState,
    form: initialValidateBoardState,
}
