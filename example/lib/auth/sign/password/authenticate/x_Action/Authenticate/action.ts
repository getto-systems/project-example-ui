import { ApplicationAction } from "../../../../../../z_vendor/getto-application/action/action"
import {
    initialValidateBoardState,
    ValidateBoardState,
} from "../../../../../../z_vendor/getto-application/board/validateBoard/x_Action/ValidateBoard/action"
import { AuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/action"
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

export type AuthenticatePasswordResource = AuthSignLinkResource &
    Readonly<{ authenticate: AuthenticatePasswordAction }>

export interface AuthenticatePasswordAction extends ApplicationAction {
    readonly core: CoreAction
    readonly form: FormAction
}

export type AuthenticatePasswordResourceState = Readonly<{
    core: CoreState
    form: ValidateBoardState
}>
export const initialAuthenticatePasswordState: AuthenticatePasswordResourceState = {
    core: initialCoreState,
    form: initialValidateBoardState,
}
