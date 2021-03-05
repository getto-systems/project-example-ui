import { ApplicationAction } from "../../../../../../z_vendor/getto-application/action/action"
import {
    initialValidateBoardState,
    ValidateBoardActionState,
} from "../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { SignLinkResource } from "../../../../common/link/Action/action"
import {
    CoreAction,
    CoreState,
    initialCoreState,
} from "./Core/action"
import { FormAction } from "./Form/action"

export type AuthenticatePasswordEntryPoint = Readonly<{
    resource: AuthenticatePasswordResource
    terminate: { (): void }
}>

export type AuthenticatePasswordResource = SignLinkResource &
    Readonly<{ authenticate: AuthenticatePasswordAction }>

export interface AuthenticatePasswordAction extends ApplicationAction {
    readonly core: CoreAction
    readonly form: FormAction
}

export type AuthenticatePasswordResourceState = Readonly<{
    core: CoreState
    form: ValidateBoardActionState
}>
export const initialAuthenticatePasswordState: AuthenticatePasswordResourceState = {
    core: initialCoreState,
    form: initialValidateBoardState,
}
