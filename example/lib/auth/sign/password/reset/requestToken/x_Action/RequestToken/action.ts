import { ApplicationAction } from "../../../../../../../z_vendor/getto-application/action/action"
import {
    initialValidateBoardState,
    ValidateBoardActionState,
} from "../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { SignSearchResource } from "../../../../../common/search/Action/action"
import { initialCoreState, CoreAction, CoreState } from "./Core/action"
import { FormAction } from "./Form/action"

export type RequestPasswordResetTokenEntryPoint = Readonly<{
    resource: RequestPasswordResetTokenResource
    terminate: { (): void }
}>

export type RequestPasswordResetTokenResource = SignSearchResource &
    Readonly<{ requestToken: RequestPasswordResetTokenAction }>

export interface RequestPasswordResetTokenAction extends ApplicationAction {
    readonly core: CoreAction
    readonly form: FormAction
}

export type RequestPasswordResetTokenResourceState = Readonly<{
    core: CoreState
    form: ValidateBoardActionState
}>
export const initialRequestPasswordResetTokenState: RequestPasswordResetTokenResourceState = {
    core: initialCoreState,
    form: initialValidateBoardState,
}
