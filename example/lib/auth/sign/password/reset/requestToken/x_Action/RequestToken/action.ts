import { ApplicationAction } from "../../../../../../../z_getto/action/action"
import {
    initialValidateBoardState,
    ValidateBoardState,
} from "../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { AuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/action"
import { initialCoreState, CoreAction, CoreState } from "./Core/action"
import { FormAction } from "./Form/action"

export type RequestPasswordResetTokenEntryPoint = Readonly<{
    resource: RequestPasswordResetTokenResource
    terminate: { (): void }
}>

export type RequestPasswordResetTokenResource = AuthSignLinkResource &
    Readonly<{ requestToken: RequestPasswordResetTokenAction }>

export interface RequestPasswordResetTokenAction extends ApplicationAction {
    readonly core: CoreAction
    readonly form: FormAction
}

export type RequestPasswordResetTokenResourceState = Readonly<{
    core: CoreState
    form: ValidateBoardState
}>
export const initialRequestPasswordResetTokenState: RequestPasswordResetTokenResourceState = {
    core: initialCoreState,
    form: initialValidateBoardState,
}