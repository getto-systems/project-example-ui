import { ApplicationAction } from "../../../../../../../z_getto/application/action"
import {
    initialValidateBoardState,
    ValidateBoardState,
} from "../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { AuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/action"
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

export type ResetPasswordResource = AuthSignLinkResource & Readonly<{ reset: ResetPasswordAction }>

export interface ResetPasswordAction extends ApplicationAction {
    readonly core: CoreAction
    readonly form: FormAction
}

export type ResetPasswordResourceState = Readonly<{
    core: CoreState
    form: ValidateBoardState
}>
export const initialResetPasswordState: ResetPasswordResourceState = {
    core: initialCoreState,
    form: initialValidateBoardState,
}
